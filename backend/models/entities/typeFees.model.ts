import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '@/src/database';
import { TypeFeesCreationAttributes, TypeFees } from '@/models/interface/typeFees.interface';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class TypeFeesModel extends Model<TypeFees, TypeFeesCreationAttributes> implements TypeFees {
  public id_typeFees!: number;
  public name_typeFees!: string;

  
}

// Inicializar el modelo
TypeFeesModel.init({
  id_typeFees: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true
  },
  name_typeFees: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: 'typefees',
  timestamps: false
});



export default TypeFeesModel;