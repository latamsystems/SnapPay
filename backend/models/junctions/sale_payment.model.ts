import { DataTypes, Model, Association } from 'sequelize';
import { dbConnection } from '@/src/database';
import { Sale_PaymentCreationAttributes, Sale_Payment } from '@/models/interface/sale_payment.interface';
import Sale from '@/models/core/sale.model';
import Payment from '@/models/core/payment.model';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class Sale_PaymentModel extends Model<Sale_Payment, Sale_PaymentCreationAttributes> implements Sale_Payment {
  public id_sale_payment!: number;
  public id_sale!: number;
  public id_payment!: number;
  public readonly sale?: Sale;
  public readonly payment?: Payment;

  public static readonly associations: {
    sale: Association<Sale_PaymentModel, Sale>;
    payment: Association<Sale_PaymentModel, Payment>;
  };
}

// Inicializar el modelo
Sale_PaymentModel.init({
  id_sale_payment: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  id_sale: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Sale,
      key: 'id_sale'
    }
  },
  id_payment: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Payment,
      key: 'id_payment'
    }
  }
}, {
  sequelize: dbConnection,
  tableName: 'sale_payment',
  timestamps: false
});

Sale_PaymentModel.belongsTo(Sale, { foreignKey: 'id_sale', as: 'sale' });
Sale_PaymentModel.belongsTo(Payment, { foreignKey: 'id_payment', as: 'payment' });

export default Sale_PaymentModel;