import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '@/src/database';
import { RoleCreationAttributes, RoleModel } from '@/models/interface/role.interface';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class Role extends Model<RoleModel, RoleCreationAttributes> implements RoleModel {
  public id_role!: number;
  public name_role!: string;
}

// Inicializar el modelo
Role.init({
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

export default Role;
