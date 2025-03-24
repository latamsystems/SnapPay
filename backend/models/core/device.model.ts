import { DataTypes, Model, Association } from 'sequelize';
import { dbConnection } from '@/src/database';
import { DeviceCreationAttributes, Device } from '@/models/interface/device.interface';
import ModelP from '@/models/core/model.model';
import User from '@/models/core/user.model';
import Status from '@/models/entities/status.model';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class DeviceModel extends Model<Device, DeviceCreationAttributes> implements Device {
  public id_device!: number;
  public price_device!: number;
  public id_model!: number;
  public id_user!: number;
  public id_status!: number;
  public readonly model?: ModelP;
  public readonly user?: User;
  public readonly status?: Status;

  public static readonly associations: {
    model: Association<DeviceModel, Model>;
    user: Association<DeviceModel, User>;
    status: Association<DeviceModel, Status>;
  };
}

// Inicializar el modelo
DeviceModel.init({
  id_device: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  price_device: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  id_model: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: ModelP,
      key: 'id_model'
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
  }
}, {
  sequelize: dbConnection,
  tableName: 'device',
  timestamps: false
});

DeviceModel.belongsTo(ModelP, { foreignKey: 'id_model', as: 'model' });
DeviceModel.belongsTo(User, { foreignKey: 'id_user', as: 'user' });
DeviceModel.belongsTo(Status, { foreignKey: 'id_status', as: 'status' });

export default DeviceModel;