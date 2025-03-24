import { DataTypes, Model, Association } from 'sequelize';
import { dbConnection } from '@/src/database';
import { FineCreationAttributes, Fine } from '@/models/interface/fine.interface';
import User from '@/models/core/user.model';
import Status from '@/models/entities/status.model';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class FineModel extends Model<Fine, FineCreationAttributes> implements Fine {
  public id_fine!: number;
  public value_fine!: number;
  public id_user!: number;
  public id_status!: number;
  public payment_in_fine?: Date | null;
  public created_at_fine!: Date;
  public readonly user?: User;
  public readonly status?: Status;

  public static readonly associations: {
    user: Association<FineModel, User>;
    status: Association<FineModel, Status>;
  };
}

// Inicializar el modelo
FineModel.init({
  id_fine: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  value_fine: {
    type: DataTypes.DOUBLE,
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
  payment_in_fine: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at_fine: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize: dbConnection,
  tableName: 'fine',
  timestamps: false
});

FineModel.belongsTo(User, { foreignKey: 'id_user', as: 'user' });
FineModel.belongsTo(Status, { foreignKey: 'id_status', as: 'status' });

export default FineModel;