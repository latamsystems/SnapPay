import { DataTypes, Model, Association } from 'sequelize';
import { dbConnection } from '@/src/database';
import { SaleCreationAttributes, Sale } from '@/models/interface/sale.interface';
import Client from '@/models/core/client.model';
import Device from '@/models/core/device.model';
import User from '@/models/core/user.model';
import Status from '@/models/entities/status.model';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class SaleModel extends Model<Sale, SaleCreationAttributes> implements Sale {
  public id_sale!: number;
  public imei_sale!: string;
  public fees_sale!: number;
  public isFine_sale!: boolean;
  public id_client!: number;
  public id_device!: number;
  public id_user!: number;
  public id_status!: number;
  public activation_at_sale?: Date | null;
  public finish_at_sale?: Date | null;
  public created_at_sale!: Date;
  public readonly client?: Client;
  public readonly device?: Device;
  public readonly user?: User;
  public readonly status?: Status;

  public static readonly associations: {
    client: Association<SaleModel, Client>;
    device: Association<SaleModel, Device>;
    user: Association<SaleModel, User>;
    status: Association<SaleModel, Status>;
  };
}

// Inicializar el modelo
SaleModel.init({
  id_sale: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  imei_sale: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fees_sale: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  isFine_sale: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  id_client: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Client,
      key: 'id_client'
    }
  },
  id_device: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Device,
      key: 'id_device'
    }
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
  activation_at_sale: {
    type: DataTypes.DATE,
    allowNull: true
  },
  finish_at_sale: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at_sale: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize: dbConnection,
  tableName: 'sale',
  timestamps: false
});

SaleModel.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });
SaleModel.belongsTo(Device, { foreignKey: 'id_device', as: 'device' });
SaleModel.belongsTo(User, { foreignKey: 'id_user', as: 'user' });
SaleModel.belongsTo(Status, { foreignKey: 'id_status', as: 'status' });

export default SaleModel;