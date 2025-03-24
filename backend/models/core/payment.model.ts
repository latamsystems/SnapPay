import { DataTypes, Model, Association } from 'sequelize';
import { dbConnection } from '@/src/database';
import { PaymentCreationAttributes, Payment } from '@/models/interface/payment.interface';
import Status from '@/models/entities/status.model';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class PaymentModel extends Model<Payment, PaymentCreationAttributes> implements Payment {
  public id_payment!: number;
  public numDocument_payment!: string;
  public value_payment!: number;
  public media_payment!: string;
  public id_status!: number;
  public validated_in_payment?: Date | null;
  public created_at_payment!: Date;
  public readonly status?: Status;

  public static readonly associations: {
    status: Association<PaymentModel, Status>;
  };
}

// Inicializar el modelo
PaymentModel.init({
  id_payment: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  numDocument_payment: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  value_payment: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  media_payment: {
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
  validated_in_payment: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at_payment: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize: dbConnection,
  tableName: 'payment',
  timestamps: false
});

PaymentModel.belongsTo(Status, { foreignKey: 'id_status', as: 'status' });

export default PaymentModel;