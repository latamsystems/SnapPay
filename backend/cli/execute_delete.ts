import 'module-alias/register';
import { Sequelize } from 'sequelize';
import { dbConnection } from '@/src/database';
import Console from '@/helpers/console';

// Nombre de servicio
const consoleHelper = new Console("DELETE CONFIG");

// Configuración de las tablas a excluir
const tablasExcluidas = process.argv.slice(2);

// Función para eliminar todas las tablas excepto las excluidas
async function eliminarTablas() {
    try {
        // Desactivar las restricciones de clave foránea
        await dbConnection.query('SET FOREIGN_KEY_CHECKS = 0;');

        // Obtener todas las tablas en la base de datos
        const [tablas] = await dbConnection.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = '${dbConnection.config.database}';
        `);

        // Filtrar las tablas excluidas
        const tablasAEliminar = tablas
            .map((tabla: any) => tabla.table_name)
            .filter((nombre: any) => !tablasExcluidas.includes(nombre));

        if (tablasAEliminar.length === 0) {
            consoleHelper.info('No hay tablas para eliminar. Todas las tablas están excluidas.', false);
            return;
        }

        // Generar y ejecutar el comando DROP TABLE para todas las tablas a eliminar
        const dropStatement = `DROP TABLE IF EXISTS ${tablasAEliminar.join(', ')};`;
        await dbConnection.query(dropStatement);

        consoleHelper.success('Tablas eliminadas exitosamente', false);
        console.log(tablasAEliminar);

    } catch (error) {
        consoleHelper.error('Error al eliminar las tablas', false);
        console.error(error);
    } finally {
        // Reactivar las restricciones de clave foránea
        await dbConnection.query('SET FOREIGN_KEY_CHECKS = 1;');

        // Cerrar la conexión
        if (dbConnection instanceof Sequelize) {
            await dbConnection.close();
        }
    }
}

eliminarTablas();
