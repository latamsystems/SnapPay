import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '@/src/database';
import { BrandCreationAttributes, Brand } from '@/models/interface/brand.interface';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class BrandModel extends Model<Brand, BrandCreationAttributes> implements Brand {
  public id_brand!: number;
  public name_brand!: string;

  
}

// Inicializar el modelo
BrandModel.init({
  id_brand: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name_brand: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: 'brand',
  timestamps: false
});



export default BrandModel;