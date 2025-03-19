import { Sequelize, Op } from "sequelize";

// ============================================================================

/**
 * Configuración de la consulta principal
 * @param config - Configuración adicional
 * @param queryParams - Parámetros de consulta de la petición
 * @param model - Modelo de Sequelize
 * @param id - ID opcional para consultas específicas
 * @returns queryOptions - Configuración final para Sequelize
 */
const configQuery = async (config: any, queryParams: any, model: any, id: number | null = null) => {
    const primaryKeyField = Object.keys(model.primaryKeys || { id: "id" })[0] || "id";

    const {
        page,
        filter,
        search,
        searchFields,
        limit,
        sortBy,
        sortOrder
    } = extractQueryParams(queryParams, primaryKeyField);

    const queryOptions: any = {
        limit,
        offset: (page - 1) * limit,
        where: id ? { [primaryKeyField]: id } : {},
        distinct: true // Evitar duplicados en los resultados
    };

    includeAttributes(queryOptions, config);
    applyFilters(queryOptions, filter);
    applySearch(queryOptions, search, searchFields);
    applySorting(queryOptions, sortBy, sortOrder);

    return await applyPagination(queryOptions, model, id, queryParams, limit);
};

// ============================================================================

/**
 * Extraer los parámetros de consulta con valores por defecto
 * @param queryParams - Parámetros de consulta
 * @param primaryKeyField - Clave primaria del modelo
 */
const extractQueryParams = (queryParams: any, primaryKeyField: string) => ({
    page: Math.max(parseInt(queryParams.page, 10) || 1, 1),
    filter: queryParams.filter || {},
    search: queryParams.search || "",
    searchFields: queryParams.searchFields || [],
    limit: parseInt(queryParams.limit, 10) > 0 ? parseInt(queryParams.limit, 10) : 1000,
    sortBy: queryParams.sortBy || primaryKeyField,
    sortOrder: (queryParams.sortOrder || "DESC").toUpperCase(),
});

// ============================================================================

/**
 * Incluir relaciones y atributos en la consulta
 * @param queryOptions - Objeto de configuración de Sequelize
 * @param config - Configuración adicional
 */
const includeAttributes = (queryOptions: any, config: any) => {
    if (config && typeof config === "object") {
        if (config.include && Array.isArray(config.include)) {
            queryOptions.include = config.include;
        }
        if (config.attributes && typeof config.attributes === "object") {
            queryOptions.attributes = config.attributes;
        }
    }
};

// ============================================================================

/**
 * Aplicar filtros exactos a la consulta
 * @param queryOptions - Objeto de configuración de Sequelize
 * @param filter - Filtros proporcionados en la petición
 */
const applyFilters = (queryOptions: any, filter: any) => {
    if (filter && typeof filter === "object") {
        Object.keys(filter).forEach((key) => {
            queryOptions.where[key] = filter[key];
        });
    }
};

// ============================================================================

/**
 * Aplicar búsqueda en los campos especificados
 * @param queryOptions - Objeto de configuración de Sequelize
 * @param search - Término de búsqueda
 * @param searchFields - Campos en los que se buscará
 */
const applySearch = (queryOptions: any, search: string, searchFields: string[]) => {
    if (!search || !Array.isArray(searchFields) || searchFields.length === 0) return;

    const orConditions: any = [];

    searchFields.forEach(field => {
        if (field === 'client') return; // Ignorar referencias a relaciones

        const fieldParts = field.split('.');

        if (fieldParts.length === 1) {
            orConditions.push({ [field]: { [Op.like]: `%${search}%` } });
        } else {
            orConditions.push(
                Sequelize.where(
                    Sequelize.col(`\`${fieldParts.join('.')}\``),
                    { [Op.like]: `%${search}%` }
                )
            );

            let currentIncludes = queryOptions.include;
            fieldParts.slice(0, -1).forEach((part: any) => {
                const include = currentIncludes?.find((inc: any) => inc.as === part);
                if (include) {
                    include.required = false;
                    if (!include.include) {
                        include.include = [];
                    }
                    currentIncludes = include.include;
                }
            });
        }
    });

    if (orConditions.length > 0) {
        queryOptions.where = { ...queryOptions.where, [Op.or]: orConditions };
    }

    configureIncludes(queryOptions.include);
};

// ============================================================================

/**
 * Configurar includes como LEFT JOIN
 * @param includes - Lista de includes en Sequelize
 */
const configureIncludes = (includes: any) => {
    if (!includes) return;
    includes.forEach((include: any) => {
        include.required = false;
        if (include.include) {
            configureIncludes(include.include);
        }
    });
};

// ============================================================================

/**
 * Aplicar ordenamiento en la consulta
 * @param queryOptions - Objeto de configuración de Sequelize
 * @param sortBy - Campo por el cual se ordenará
 * @param sortOrder - Orden (ASC o DESC)
 */
const applySorting = (queryOptions: any, sortBy: string, sortOrder: string) => {
    if (sortBy.includes(".")) {
        queryOptions.order = [[Sequelize.col(`${sortBy}`), sortOrder]];
    } else {
        queryOptions.order = [[sortBy, sortOrder]];
    }
};

// ============================================================================

/**
 * Aplicar paginación a la consulta
 * @param queryOptions - Objeto de configuración de Sequelize
 * @param model - Modelo de Sequelize
 * @param id - ID opcional para consultas específicas
 * @param queryParams - Parámetros de consulta
 * @param limit - Límite de registros por página
 */
const applyPagination = async (queryOptions: any, model: any, id: number | null, queryParams: any, limit: number) => {
    let totalRecords = 0;
    let totalPages = 0;
    let currentPage = parseInt(queryParams.page, 10) || 1;

    if (!id) {
        totalRecords = await model.count({
            where: queryOptions.where,
            include: queryOptions.include,
            distinct: true
        });
        totalPages = Math.ceil(totalRecords / limit);

        if (currentPage > totalPages) {
            currentPage = totalPages > 0 ? totalPages : 1;
            queryOptions.offset = (currentPage - 1) * limit;
        }
    }

    return {
        queryOptions,
        totalRecords,
        totalPages,
        currentPage
    };
};

// ============================================================================

export { configQuery };
