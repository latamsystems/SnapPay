// import { DataTypes, Model, Association } from 'sequelize';
// import { dbConnection } from '@/src/database';

// // Modelos relacionados
// import User from '@/models/core/user.model';
// import Status from '@/models/entities/status.model';
// import { ClientCreationAttributes, ClientModel } from '@/models/interface/client.interface';

// // Definir el modelo en TypeScript extendiendo Sequelize Model
// class Client extends Model<ClientModel, ClientCreationAttributes> implements ClientModel {
//   public id_client!: number;
//   public firstname_client!: string;
//   public lastname_client!: string;
//   public identification_client!: string;
//   public phone_client!: string;
//   public email_client!: string;
//   public id_user!: number;
//   public id_status!: number;
//   public created_at_client!: Date;
//   public inactive_in_client?: Date | null;

//   // Definir asociaciones
//   public readonly user?: User;
//   public readonly status?: Status;

//   public static readonly associations: {
//     user: Association<Client, User>;
//     status: Association<Client, Status>;
//   };
// }

// // Inicializar el modelo
// Client.init({
//   id_client: {
//     type: DataTypes.INTEGER.UNSIGNED,
//     primaryKey: true,
//     allowNull: false,
//     autoIncrement: true
//   },
//   firstname_client: {
//     type: DataTypes.STRING(100),
//     allowNull: false
//   },
//   lastname_client: {
//     type: DataTypes.STRING(100),
//     allowNull: false
//   },
//   identification_client: {
//     type: DataTypes.STRING(10),
//     allowNull: false,
//     unique: true
//   },
//   email_client: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//     unique: true
//   },
//   id_user: {
//     type: DataTypes.INTEGER.UNSIGNED,
//     allowNull: false,
//     references: {
//       model: User,
//       key: 'id_user'
//     }
//   },
//   id_status: {
//     type: DataTypes.INTEGER.UNSIGNED,
//     allowNull: false,
//     references: {
//       model: Status,
//       key: 'id_status'
//     }
//   },
//   created_at_client: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW
//   },
//   inactive_in_client: {
//     type: DataTypes.DATE,
//     allowNull: true,
//     defaultValue: null
//   }
// }, {
//   sequelize: dbConnection,  // Conexión a la base de datos
//   tableName: 'client',
//   timestamps: false
// });

// // Definir las asociaciones (relaciones)
// Client.belongsTo(User, { foreignKey: 'id_user', as: 'user' });
// Client.belongsTo(Status, { foreignKey: 'id_status', as: 'status' });

// export default Client;
