import 'module-alias/register';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import Console from '@/helpers/console';

// Nombre de servicio
const consoleHelper = new Console('MODEL CONFIG');

// Usa process.cwd() para resolver bien los alias con ts-node
const BASE_DIR = process.cwd();

// Configuración de carpetas usando alias reales
const INTERFACE_DIR = path.resolve(BASE_DIR, 'models/interface');
const OUTPUT_DIRS = {
    'Entities': path.resolve(BASE_DIR, 'models/entities'),
    'Core': path.resolve(BASE_DIR, 'models/core')
};

const getInterfaceFiles = () =>
    fs.readdirSync(INTERFACE_DIR).filter(file => file.endsWith('.interface.ts'));

const extractInterfaceName = (fileName: string) => fileName.replace('.interface.ts', '');

const parseFields = (content: string) => {
    const fields: {
        name: string;
        type: string;
        optional: boolean;
        isRelation: boolean;
    }[] = [];

    const lines = content.split('\n');
    for (const line of lines) {
        const match = line.trim().match(/^(\w+)\??:\s*([^;]+);/);
        if (match) {
            const [, name, rawType] = match;
            const type = rawType.trim();
            const optional = line.includes('?:') || type.includes('| null');
            const baseType = type.replace('| null', '').trim();

            fields.push({
                name,
                type,
                optional,
                isRelation: /^[A-Z]/.test(baseType) && !['Date', 'string', 'number', 'boolean'].includes(baseType)
            });
        }
    }

    return fields;
};


const generateModelCode = (
    modelName: string,
    fields: ReturnType<typeof parseFields>,
    creationInterface: string,
    originalInterface: string
): string => {
    const className = `${modelName.charAt(0).toUpperCase() + modelName.slice(1)}Model`;
    const tableName = modelName.toLowerCase();

    const imports = [
        `import { DataTypes, Model${fields.some(f => f.isRelation) ? ', Association' : ''} } from 'sequelize';`,
        `import { dbConnection } from '@/src/database';`,
        `import { ${creationInterface}, ${originalInterface} } from '@/models/interface/${modelName}.interface';`
    ];

    const relationImports = fields
        .filter(f => f.isRelation)
        .map(f => `import ${f.type} from '@/models/entities/${f.type.toLowerCase()}.model';`);

    const fieldDeclarations = fields
        .filter(f => !f.isRelation)
        .map(f => `  public ${f.name}${f.optional ? '?' : '!'}: ${f.type};`);

    const relationDeclarations = fields
        .filter(f => f.isRelation)
        .map(f => `  public readonly ${f.name.replace(/^id_/, '')}?: ${f.type};`);

    const associationTypes = fields
        .filter(f => f.isRelation)
        .map(f => `    ${f.name.replace(/^id_/, '')}: Association<${className}, ${f.type}>;`);

    const initFields = fields
        .filter(f => !f.isRelation)
        .map(f => {
            const cleanType = f.type.replace('| null', '').trim();
            let typeStr = 'DataTypes.STRING';
            if (cleanType === 'number') typeStr = 'DataTypes.INTEGER.UNSIGNED';
            if (cleanType === 'Date') typeStr = 'DataTypes.DATE';

            const isPrimary = f === fields[0];
            const isCreatedAt = f.name.startsWith('created_at');

            const relation = fields.find(r => r.isRelation && f.name === `id_${r.type.toLowerCase()}`);

            return `  ${f.name}: {
    type: ${typeStr},
    allowNull: ${f.optional ? 'true' : 'false'}${isPrimary ? ',\n    primaryKey: true,\n    autoIncrement: true' : ''}${isCreatedAt ? ',\n    defaultValue: DataTypes.NOW' : ''}${relation ? `,
    references: {
      model: ${relation.type},
      key: '${f.name}'
    }` : ''}
  }`;
        });

    const associations = fields
        .filter(f => f.isRelation)
        .map(f =>
            `${className}.belongsTo(${f.type}, { foreignKey: '${`id_${f.type.toLowerCase()}`}', as: '${f.name}' });`
        );

    return `\
${[...imports, ...relationImports].join('\n')}

// Definir el modelo en TypeScript extendiendo Sequelize Model
class ${className} extends Model<${originalInterface}, ${creationInterface}> implements ${originalInterface} {
${[...fieldDeclarations, ...relationDeclarations].join('\n')}

  ${fields.some(f => f.isRelation) ? `public static readonly associations: {\n${associationTypes.join('\n')}\n  };` : ''}
}

// Inicializar el modelo
${className}.init({
${initFields.join(',\n')}
}, {
  sequelize: dbConnection,
  tableName: '${tableName}',
  timestamps: false
});

${associations.join('\n')}

export default ${className};`;
};


// Función principal
(async () => {
    const interfaces = getInterfaceFiles();
    if (interfaces.length === 0) {
        consoleHelper.info(`No se encontraron interfaces en ${INTERFACE_DIR}`);
        return;
    }

    const { selectedInterface, selectedOutput }: { selectedInterface: string; selectedOutput: keyof typeof OUTPUT_DIRS } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedInterface',
            message: 'Selecciona la interface:',
            choices: interfaces
        },
        {
            type: 'list',
            name: 'selectedOutput',
            message: 'Selecciona la carpeta de destino:',
            choices: Object.keys(OUTPUT_DIRS)
        }
    ]);

    const filePath = path.join(INTERFACE_DIR, selectedInterface);
    const content = fs.readFileSync(filePath, 'utf8');
    const interfaceName = extractInterfaceName(selectedInterface);
    const modelName = interfaceName;
    const creationInterface = `${interfaceName.charAt(0).toUpperCase() + interfaceName.slice(1)}CreationAttributes`;
    const originalInterface = `${interfaceName.charAt(0).toUpperCase() + interfaceName.slice(1)}`;

    const fields = parseFields(content);
    const modelCode = generateModelCode(modelName, fields, creationInterface, originalInterface);
    const outputPath = path.join(OUTPUT_DIRS[selectedOutput], `${modelName}.model.ts`);

    if (fs.existsSync(outputPath)) {
        consoleHelper.info(`El archivo de: ${chalk.redBright(modelName)} ya existe. No se sobrescribió.`);
    } else {
        fs.writeFileSync(outputPath, modelCode, 'utf8');
        consoleHelper.success(`Modelo generado: ${chalk.blueBright(modelName)}`);
    }

})();
