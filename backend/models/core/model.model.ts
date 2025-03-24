import { DataTypes, Model, Association } from 'sequelize';
import { dbConnection } from '@/src/database';
import { ModelCreationAttributes, Model as ModelP } from '@/models/interface/model.interface';
import Brand from '@/models/entities/brand.model';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class ModelModel extends Model<ModelP, ModelCreationAttributes> implements ModelP {
  public id_model!: number;
  public name_model!: string;
  public id_brand!: number;
  public readonly brand?: Brand;

  public static readonly associations: {
    brand: Association<ModelModel, Brand>;
  };
}

// Inicializar el modelo
ModelModel.init({
  id_model: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name_model: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  id_brand: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Brand,
      key: 'id_brand'
    }
  }
}, {
  sequelize: dbConnection,
  tableName: 'model',
  timestamps: false
});

ModelModel.belongsTo(Brand, { foreignKey: 'id_brand', as: 'brand' });

export default ModelModel;