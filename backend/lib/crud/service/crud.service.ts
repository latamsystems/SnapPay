import HttpResponse from "@/helpers/httpResponse";
import { getIo } from "@/src/websocket";
import { handleService } from "./config.service";
import { configQuery } from "@/lib/crud/config/query/params.query";
import { entityVerifyAtLeastOne, entityVerifyBooleanOnly, entityVerifyDefault } from "@/lib/crud/config/validation/entity.validation";
import Console from "@/helpers/console";
import { getNameDatabase } from "@/lib/crud/config/validation/request.validation";

// ============================================================================

/**
 * Servicio de cruds básicos
 * @param {Model} model 
 * @param {String} consoleHelper 
 * @param {Object} config 
 * @param {Object} serviceMethods 
 * @returns 
 */
const CrudService = (model: any, consoleHelper: Console, config: any = {}, serviceMethods: any = {}) => {
    // Detecta la clave primaria del modelo
    const primaryKeyField = Object.keys(model.primaryKeys || { id: "id" })[0] || "id";
    const modelName = model.name.toLowerCase();
    const nameModel = modelName.replace(/model$/, '');

    // Obtener el nombre de la base de datos
    const dbName = getNameDatabase(model);

    return {
        // Obtener todos los registros
        getAll: serviceMethods.getAll
            ? serviceMethods.getAll
            : (queryParams: any, reqMsg: any) => handleService({
                consoleHelper, async serviceFunction(...args) {
                    const [queryParams] = args as any;

                    // Llamar a configQuery para generar la configuración del query
                    const queryResult = await configQuery(config, queryParams, model);

                    // Obtener los registros con paginación y ordenamiento aplicado
                    const result = await model.findAll(queryResult.queryOptions);

                    return HttpResponse.success({
                        message: reqMsg.success,
                        data: { [nameModel]: result, },
                        meta: queryResult,
                        dbs: [dbName]
                    });
                },
                params: [queryParams],
            }),

        // Obtener un registro por ID
        getById: serviceMethods.getById
            ? serviceMethods.getById
            : (id: number, reqMsg: any) => handleService({
                consoleHelper, async serviceFunction(...args) {
                    const [id] = args as [number];

                    // Configuración de la consulta usando configQuery con el ID
                    const { queryOptions } = await configQuery(config, {}, model, id);

                    // Ejecutar la consulta
                    const result = await model.findOne(queryOptions);

                    // Verificar si el registro fue encontrado
                    if (!result) return HttpResponse.notFound({
                        message: reqMsg.notFound, field: primaryKeyField,
                        dbs: [dbName]
                    });

                    return HttpResponse.success({
                        message: reqMsg.success,
                        data: { [nameModel]: result },
                        dbs: [dbName]
                    });
                },
                params: [id]
            }),

        // Crear un registro
        create: serviceMethods.create
            ? serviceMethods.create
            : (formData: any, reqMsg: any) => handleService({
                consoleHelper, async serviceFunction(...args) {
                    const [formData] = args as [any];

                    // Validar campos obligatorios
                    const validationError: any = entityVerifyDefault(model, formData);
                    if (validationError) return HttpResponse.badRequest({
                        ...validationError,
                        dbs: [dbName]
                    });

                    // Crear el registro
                    const result = await model.create(formData);

                    // Emitir evento a todos los clientes conectados
                    const io = getIo();
                    io.emit(`${[nameModel]}:created`, result);

                    return HttpResponse.success({
                        message: reqMsg.success,
                        dbs: [dbName]
                    });
                },
                params: [formData]
            }),

        // Actualizar un registro
        update: serviceMethods.update
            ? serviceMethods.update
            : (id: number, formData: any, reqMsg: any) => handleService({
                consoleHelper, async serviceFunction(...args) {
                    const [id, formData] = args as [number, any];

                    // Verificar si el registro existe
                    const record = await model.findOne({ where: { [primaryKeyField]: id } });
                    if (!record) return HttpResponse.notFound({
                        message: reqMsg.notFound, field: primaryKeyField,
                        dbs: [dbName]
                    });

                    // Validar al menos un campo obligatorio
                    const validationError = entityVerifyAtLeastOne(model, formData);
                    if (validationError) return HttpResponse.badRequest({
                        ...validationError,
                        dbs: [dbName]
                    });

                    // Actualizar el registro
                    const result = await model.update(formData, { where: { [primaryKeyField]: id } });

                    // Emitir evento a todos los clientes conectados
                    const io = getIo();
                    io.emit(`${[nameModel]}:updated`, result);

                    return HttpResponse.success({
                        message: reqMsg.success,
                        dbs: [dbName]
                    });
                },
                params: [id, formData]
            }),

        // Eliminar un registro
        delete: serviceMethods.delete
            ? serviceMethods.delete
            : (id: number, reqMsg: any) => handleService({
                consoleHelper, async serviceFunction(...args) {
                    const [id] = args as [number];

                    // Verificar si el registro existe
                    const record = await model.findOne({ where: { [primaryKeyField]: id } });
                    if (!record) return HttpResponse.notFound({
                        message: reqMsg.notFound,
                        field: primaryKeyField,
                        dbs: [dbName]
                    });

                    // Eliminar el registro
                    const result = await model.destroy({ where: { [primaryKeyField]: id } });

                    // Emitir evento a todos los clientes conectados
                    const io = getIo();
                    io.emit(`${[modelName]}:deleted`, result);

                    return HttpResponse.success({
                        message: reqMsg.success,
                        dbs: [dbName]
                    });
                },
                params: [id]
            }),

        // Actualizar un registro
        enable: serviceMethods.enable
            ? serviceMethods.enable
            : (id: number, formData: any, reqMsg: any) => handleService({
                consoleHelper, async serviceFunction(...args) {
                    const [id, formData] = args as [number, any];

                    // Verificar si el registro existe
                    const record = await model.findOne({ where: { [primaryKeyField]: id } });
                    if (!record) return HttpResponse.notFound({
                        message: reqMsg.notFound,
                        field: primaryKeyField,
                        dbs: [dbName]
                    });

                    // Validar al menos un campo obligatorio
                    const validationError: any = entityVerifyBooleanOnly(model, formData);
                    if (validationError) return HttpResponse.badRequest({
                        ...validationError,
                        dbs: [dbName]
                    });

                    // Actualizar el registro
                    const result = await model.update(formData, { where: { [primaryKeyField]: id } });

                    // Emitir evento a todos los clientes conectados
                    const io = getIo();
                    io.emit(`${[modelName]}:enabled`, result);

                    return HttpResponse.success({
                        message: reqMsg.success,
                        dbs: [dbName]
                    });
                },
                params: [id, formData]
            }),
    };
};

// ============================================================================

export { CrudService };
