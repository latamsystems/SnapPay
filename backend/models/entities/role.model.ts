import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '@/src/database';
import { RoleCreationAttributes, Role } from '@/models/interface/role.interface';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class RoleModel extends Model<Role, RoleCreationAttributes> implements Role {
  public id_role!: number;
  public name_role!: string;
}

// Inicializar el modelo
RoleModel.init({
  id_role: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name_role: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  sequelize: dbConnection,  // Conexión a la base de datos
  tableName: 'role',
  timestamps: false
});

export default RoleModel;
