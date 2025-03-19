require('module-alias/register');
import fs from 'fs';
import path from 'path';

// Ruta de la carpeta models
const modelsDir = path.resolve(process.cwd(), 'models');
const initModelsFile = path.resolve(modelsDir, 'init-models.ts');

const importStatements: string[] = [];
const exportStatements: string[] = [];

/**
 * Función recursiva para buscar archivos .model.ts en subdirectorios
 */
function buscarArchivosModel(directorio: string): void {
  // Leer todos los archivos y carpetas en el directorio actual
  const archivos = fs.readdirSync(directorio);

  archivos.forEach(archivo => {
    const rutaCompleta = path.join(directorio, archivo);
    const estadisticas = fs.statSync(rutaCompleta);

    if (estadisticas.isDirectory()) {
      // Si es una carpeta, buscar recursivamente
      buscarArchivosModel(rutaCompleta);
    } else if (rutaCompleta.endsWith('.model.ts') && archivo !== 'init-models.ts') {
      // Si es un archivo .model.ts, agregarlo a las importaciones
      let relativePath = path.relative(modelsDir, rutaCompleta).replace(/\\/g, '/');
      relativePath = relativePath.replace('.ts', ''); // 🔹 Remover extensión .ts
      
      const modelName = archivo.replace('.model.ts', '');
      const modelNamePascal = modelName.charAt(0).toUpperCase() + modelName.slice(1);

      // Construir las líneas de importación y exportación en TypeScript
      importStatements.push(`import ${modelNamePascal} from '@/models/${relativePath}';`);
      exportStatements.push(`  ${modelNamePascal},`);
    }
  });
}

// Iniciar la búsqueda recursiva en la carpeta models
buscarArchivosModel(modelsDir);

// Generar el contenido de init-models.ts
const fileContent = `/**
 * Este archivo fue generado automáticamente.
 * No lo edites manualmente, ejecuta execute_model.ts o npm run model para actualizarlo.
 */

${importStatements.join('\n')}

const models = {
${exportStatements.join('\n')}
};

export default models;
`;

// Escribir el archivo init-models.ts
fs.writeFileSync(initModelsFile, fileContent, 'utf8');

// Confirmación
console.log(`✅ Archivo generado: ${initModelsFile}`);
