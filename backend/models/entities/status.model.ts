import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '@/src/database';
import { StatusCreationAttributes, Status } from '@/models/interface/status.interface';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class StatusModel extends Model<Status, StatusCreationAttributes> implements Status {
  public id_status!: number;
  public name_status!: string;
}

// Inicializar el modelo
StatusModel.init({
  id_status: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name_status: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  sequelize: dbConnection,  // Conexión a la base de datos
  tableName: 'status',
  timestamps: false
});

export default StatusModel;
