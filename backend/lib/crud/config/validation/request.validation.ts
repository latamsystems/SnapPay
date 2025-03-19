
import Sequelize, { Model, ModelStatic } from "sequelize";
import bcrypt from "bcrypt";
import HttpResponse from "@/helpers/httpResponse";

// =============================================================================

type AvailableRules = keyof typeof rule;

interface RuleParams {
    model: ModelStatic<Model<any, any>>;
    formData?: any;
}

type ValidationRule = ({ model, formData }: RuleParams) => Promise<void> | void;

interface ValidateRequest<F> {
    model: ModelStatic<Model<any, any>>;
    rules: (ReturnType<typeof rule[AvailableRules]>)[];
    formData?: F;
}

/**
 * Función principal de validación configurable
 * @param {Model} model - Modelo de Sequelize
 * @param {Array} rules - Reglas de validación
 * @param {Object} formData - Datos a validar
 */
export const validateRequest = async <F>({ model, rules, formData }: ValidateRequest<F>) => {
    for (const rule of rules) await rule({ model, formData });
};

// =============================================================================
// Reglas de validación
// =============================================================================

/**
 * Validación de tipos de datos y longitud máxima
 * Verifica que los campos enviados coincidan con los tipos y longitudes definidos en el modelo de Sequelize
 * @param {Model} model - Modelo de Sequelize
 * @param {Object} formData - Datos a validar
 */
const validateFieldTypes = (): ValidationRule => ({ model, formData }) => {
    const errors: { field: string; info: string }[] = [];

    Object.entries(model.getAttributes()).forEach(([field, attribute]: [string, any]) => {
        const value = formData[field];

        // Verificar longitud máxima si es STRING o CHAR
        if ((attribute.type instanceof Sequelize.STRING || attribute.type instanceof Sequelize.CHAR)
            && attribute.type._length
            && value && value.length > attribute.type._length) {
            errors.push({
                field,
                info: `La longitud máxima es de ${attribute.type._length} caracteres.`
            });
        }

        // Verificar tipo de datos
        if (value !== undefined && value !== null) {
            const expectedType = attribute.type.key;
            const actualType = typeof value;

            // Mapear tipos de Sequelize a tipos de JavaScript
            const typeMap: { [key: string]: string } = {
                STRING: 'string',
                CHAR: 'string',
                TEXT: 'string',
                INTEGER: 'number',
                BIGINT: 'string',
                BOOLEAN: 'boolean',
                FLOAT: 'number',
                DOUBLE: 'number',
                DECIMAL: 'string', // Decimales se manejan como string para precisión
                DATE: 'string',
                ENUM: 'string'
            };

            if (typeMap[expectedType] && actualType !== typeMap[expectedType]) {
                errors.push({
                    field,
                    info: `El campo es de tipo "${typeMap[expectedType]}", pero se recibió "${actualType}".`
                });
            }
        }
    });

    if (errors.length > 0) throw HttpResponse.badRequest({ message: "Errores de validación en los campos.", fields: errors });
}


// =============================================================================

/**
 * Validación de campos obligatorios
 * @param {Array} fields - Campos requeridos
 * @param {String} formData - Datos a validar
 */
const requiredFields = (fields: string[]): ValidationRule => ({ formData }) => {
    const errorMessage = "Faltan campos obligatorios";

    const missingFields = fields.filter((field: string) =>
        formData[field] === undefined ||
        formData[field] === null ||
        formData[field] === ""
    );

    if (missingFields.length > 0) throw HttpResponse.badRequest({ message: errorMessage, missingFields });
};

// =============================================================================

/**
 * Verificación de existencia de registro
 * @param {Number} id - ID del registro
 * @param {String} errorMessage - Mensaje de error
 * @param {Model} model - Modelo de Sequelize
 */
const recordExists = (id: number, errorMessage: string): ValidationRule => async ({ model }) => {
    const primaryKeyField = model.primaryKeyAttributes[0] || "id";
    const record = await model.findOne({ where: { [primaryKeyField]: id } });

    if (!record) throw HttpResponse.notFound({ message: errorMessage, field: primaryKeyField });
}

// =============================================================================

/**
 * Verificación de unicidad en Base de Datos
 * @param {String} field - Campo a verificar
 * @param {String} errorMessage - Mensaje de error
 * @param {Number} id - ID del registro (opcional)
 * @param {Model} model - Modelo de Sequelize
 * @param {Object} formData - Datos a validar
 */
const uniqueField = (field: string, errorMessage: string, id?: number): ValidationRule => async ({ model, formData }) => {
    const primaryKeyField = model.primaryKeyAttributes[0] || "id";

    const record = await model.findOne({ where: { [field]: formData[field] } });

    if (!id && record) throw HttpResponse.conflict({ message: errorMessage, field });

    if (id && record) {
        const primaryKey = record.getDataValue(primaryKeyField as keyof typeof record);
        if (primaryKey !== Number(id)) throw HttpResponse.conflict({ message: errorMessage, field });
    }
};


// =============================================================================

/**
 * Verificación de email válido
 * @param {String} field - Campo a verificar
 * @param {Object} formData - Datos a validar
 */
const validEmail = (field: string): ValidationRule => ({ formData }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData[field] && !emailRegex.test(formData[field])) {
        throw HttpResponse.badRequest({ message: 'Correo electrónico inválido.', field });
    }
};

// =============================================================================

/**
 * Validación de contraseña
 * @param {String} passwd - Campo de la contraseña
 * @param {String} newPasswd - Campo de la nueva contraseña
 * @param {Model} model - Datos a validar
 * @param {Object} formData - Datos a validar
 */
const checkCurrentPassword = (id: number, passwd: string, newPasswd: string): ValidationRule => async ({ model, formData }) => {
    const primaryKeyField = model.primaryKeyAttributes[0] || "id";

    const record = await model.findOne({ where: { [primaryKeyField]: id } });

    if (!record) {
        throw HttpResponse.notFound({ message: "Usuario no encontrado.", field: primaryKeyField });
    }

    // Verificamos que `record` no sea null antes de acceder a sus propiedades
    const isValidPassword = await bcrypt.compare(formData[passwd], record.getDataValue(passwd));

    // Verificamos que la nueva contraseña no sea igual a la anterior
    const isSamePassword = await bcrypt.compare(formData[newPasswd], record.getDataValue(passwd));

    if (!isValidPassword) {
        throw HttpResponse.unauthorized({ message: "La clave es incorrecta.", field: passwd });
    }
    if (isSamePassword) {
        throw HttpResponse.conflict({ message: "La nueva clave es igual a la anterior.", field: newPasswd });
    }
};

// =============================================================================

// Reglas definidas
export const rule = {
    validateFieldTypes,
    requiredFields,
    recordExists,
    uniqueField,
    validEmail,
    checkCurrentPassword
};
