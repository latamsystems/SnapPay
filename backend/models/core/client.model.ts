import { DataTypes, Model, Association } from 'sequelize';
import { dbConnection } from '@/src/database';
import { ClientCreationAttributes, Client } from '@/models/interface/client.interface';
import User from '@/models/core/user.model';
import Status from '@/models/entities/status.model';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class ClientModel extends Model<Client, ClientCreationAttributes> implements Client {
  public id_client!: number;
  public fid!: string;
  public fcm_token!: string;
  public firstname_client!: string;
  public lastname_client!: string;
  public identification_client!: string;
  public phone_client!: string;
  public email_client!: string;
  public id_user!: number;
  public id_status!: number;
  public created_at_client!: Date;
  public inactive_in_client?: Date | null;
  public readonly user?: User;
  public readonly status?: Status;

  public static readonly associations: {
    user: Association<ClientModel, User>;
    status: Association<ClientModel, Status>;
  };
}

// Inicializar el modelo
ClientModel.init({
  id_client: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  fid: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  fcm_token: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  firstname_client: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastname_client: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  identification_client: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  phone_client: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  email_client: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  id_user: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: 'id_user'
    }
  },
  id_status: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Status,
      key: 'id_status'
    }
  },
  created_at_client: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  inactive_in_client: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize: dbConnection,
  tableName: 'client',
  timestamps: false
});

ClientModel.belongsTo(User, { foreignKey: 'id_user', as: 'user' });
ClientModel.belongsTo(Status, { foreignKey: 'id_status', as: 'status' });

export default ClientModel;