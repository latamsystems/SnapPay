import Console from "@/helpers/console";

const consoleHelper = new Console("Seed Validator");

/**
  * Función genérica para verificar si el registro existe, y si no, crearlo.
  * @param model - El modelo de Sequelize (por ejemplo, `models.User`, `models.Role`, etc.)
  * @param data - Los datos que quieres insertar.
  * @param identifier - El campo que usas para verificar si el registro existe (por ejemplo, `id_user`, `id_role`, etc.)
  */
export const seedValidator = async (model: any, data: any, identifier: string) => {
    for (const item of data) {
        const existingItem = await model.findOne({ where: { [identifier]: item[identifier] } });
        if (!existingItem) {
            await model.create(item);
            consoleHelper.success(`${model.name} creado: ${item[identifier]}`);
        } else {
            consoleHelper.info(`${model.name} ya existe: ${item[identifier]}`);
        }
    }
}