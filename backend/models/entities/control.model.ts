import { DataTypes, Model, Association } from 'sequelize';
import { dbConnection } from '@/src/database';
import { ControlCreationAttributes, Control } from '@/models/interface/control.interface';
import Status from '@/models/entities/status.model';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class ControlModel extends Model<Control, ControlCreationAttributes> implements Control {
  public id_control?: number;
  public name_control!: string;
  public id_status!: number;
  public creationDate_control?: Date;
  public deactivationDate_control?: Date | null;
  public readonly status?: Status;

  public static readonly associations: {
    status: Association<ControlModel, Status>;
  };
}

// Inicializar el modelo
ControlModel.init({
  id_control: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name_control: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_status: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Status,
      key: 'id_status'
    }
  },
  creationDate_control: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  deactivationDate_control: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize: dbConnection,
  tableName: 'control',
  timestamps: false
});

ControlModel.belongsTo(Status, { foreignKey: 'id_status', as: 'status' });

export default ControlModel;