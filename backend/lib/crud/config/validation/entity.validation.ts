import { DataTypes } from 'sequelize';

/**
 * Verifica si los campos requeridos de una entidad están presentes
 * @param {Object} requiredFields - Campos a verificar
 * @returns {Object|null} - Devuelve un objeto con error si hay campos faltantes, de lo contrario, `null`
 */
export const entityVerify = (requiredFields: any) => {
    const missingFields = Object.entries(requiredFields)
        .filter(([_, value]: any) => [undefined, null, ""].includes(value))
        .map(([key]) => key);

    return missingFields.length > 0
        ? { error: true, code: 400, message: "Faltan campos obligatorios", missingFields }
        : null;
};

// ============================================================================

/**
 * Verifica los campos requeridos
 * @param {Model} model 
 * @param {Object} formData 
 * @returns {Object} Resultado con error o éxito
 */
export const entityVerifyDefault = (model: any, formData: any) => {
    if (!model.rawAttributes) return { error: false };
    
    const requiredFields = Object.entries(model.rawAttributes)
        .filter(([_, attr]: any) => (
            !attr.allowNull &&                 // No permite valores nulos
            !attr.autoIncrement &&             // No es auto-incremental
            !attr.primaryKey &&                // No es una clave primaria
            attr.defaultValue === undefined    // No tiene ningún valor por defecto
        ))
        .map(([key]) => key);

    const missingFields = requiredFields.filter(field =>
        [undefined, null, ""].includes(formData[field])
    );

    return missingFields.length > 0
        ? { error: true, code: 400, message: "Faltan campos obligatorios", missingFields }
        : null;
};


// ============================================================================

/**
 * Verifica que al menos un campo requerido esté presente y válido
 * @param {Model} model 
 * @param {Object} formData 
 * @returns {Object|null} Resultado con error o null si es válido
 */
export const entityVerifyAtLeastOne = (model: any, formData: any) => {
    if (!model.rawAttributes) return null;

    const requiredFields: any = [];
    const nullFields: any = [];

    Object.entries(model.rawAttributes).forEach(([key, attr]: any) => {
        if (formData[key] !== undefined && !attr.allowNull && [null, ""].includes(formData[key])) {
            nullFields.push(key);
        }
        if (!attr.allowNull && !attr.autoIncrement &&
            !(attr.defaultValue && (
                (typeof attr.defaultValue === 'object' && 'fn' in attr.defaultValue) ||
                attr.defaultValue._isSequelizeLiteral
            ))
        ) {
            requiredFields.push(key);
        }
    });

    const hasAtLeastOneField = requiredFields.some((field: any) =>
        ![undefined, null, ""].includes(formData[field])
    );

    if (!hasAtLeastOneField) {
        return { error: true, code: 400, message: "Se requiere al menos un campo obligatorio", requiredFields };
    }

    if (nullFields.length > 0) {
        return { error: true, code: 400, message: "Los siguientes campos no pueden ser nulos o vacíos", nullFields };
    }

    return null;
};

// ============================================================================

/**
 * Verifica que al menos un campo booleano esté presente y válido
 * @param {Model} model - Modelo de Sequelize
 * @param {Object} formData - Datos del formulario enviados
 * @returns {Object|null} - Error o lista de campos booleanos
 */
export const entityVerifyBooleanOnly = (model: any, formData: any) => {
    if (!model.rawAttributes) return { error: false, booleanFields: [] };

    const booleanFields: any = [];
    const invalidFields: any = [];
    const receivedBooleanFields = [];

    Object.entries(model.rawAttributes).forEach(([key, attr]: any) => {
        if (attr.type instanceof DataTypes.BOOLEAN) {
            booleanFields.push(key);
            if (key in formData) {
                if (typeof formData[key] === 'boolean') {
                    receivedBooleanFields.push(key);
                } else {
                    invalidFields.push(key);
                }
            }
        }
    });

    if (receivedBooleanFields.length === 0) {
        return { error: true, code: 400, message: "Debe enviar al menos un campo booleano.", booleanFields };
    }

    if (invalidFields.length > 0) {
        return { error: true, code: 400, message: "Los siguientes campos deben ser de tipo booleano.", invalidFields };
    }

    return null;
};

// ============================================================================
