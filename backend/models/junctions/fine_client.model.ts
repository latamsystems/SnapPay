import { DataTypes, Model, Association } from 'sequelize';
import { dbConnection } from '@/src/database';
import { Fine_ClientCreationAttributes, Fine_Client } from '@/models/interface/fine_client.interface';
import Fine from '@/models/core/fine.model';
import Client from '@/models/core/client.model';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class Fine_ClientModel extends Model<Fine_Client, Fine_ClientCreationAttributes> implements Fine_Client {
  public id_fine_client!: number;
  public id_fine!: number;
  public id_client!: number;
  public readonly fine?: Fine;
  public readonly client?: Client;

  public static readonly associations: {
    fine: Association<Fine_ClientModel, Fine>;
    client: Association<Fine_ClientModel, Client>;
  };
}

// Inicializar el modelo
Fine_ClientModel.init({
  id_fine_client: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  id_fine: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Fine,
      key: 'id_fine'
    }
  },
  id_client: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Client,
      key: 'id_client'
    }
  }
}, {
  sequelize: dbConnection,
  tableName: 'fine_client',
  timestamps: false
});

Fine_ClientModel.belongsTo(Fine, { foreignKey: 'id_fine', as: 'fine' });
Fine_ClientModel.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });

export default Fine_ClientModel;