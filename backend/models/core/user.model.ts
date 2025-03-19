import { DataTypes, Model, Association } from 'sequelize';
import { dbConnection } from '@/src/database';
import { UserCreationAttributes, UserModel } from '@/models/interface/user.interface';

// Modelos relacionados
import Role from '@/models/entities/role.model';
import Status from '@/models/entities/status.model';

// Definir el modelo en TypeScript extendiendo Sequelize Model
class User extends Model<UserModel, UserCreationAttributes> implements UserModel {
  public id_user!: number;
  public firstname_user!: string;
  public lastname_user!: string;
  public identification_user!: string;
  public email_user!: string;
  public password_user!: string;
  public id_role!: number;
  public id_status!: number;
  public resetPasswordToken_user?: string | null;
  public resetPasswordExpires_user?: Date | null;
  public created_at_user!: Date;
  public inactive_in_user?: Date | null;

  // Definir asociaciones
  public readonly role?: Role;
  public readonly status?: Status;

  public static readonly associations: {
    role: Association<User, Role>;
    status: Association<User, Status>;
  };
}

// Inicializar el modelo
User.init({
  id_user: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  firstname_user: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastname_user: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  identification_user: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  email_user: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password_user: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  id_role: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Role,
      key: 'id_role'
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
  resetPasswordToken_user: {
    type: DataTypes.STRING(6),
    allowNull: true
  },
  resetPasswordExpires_user: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at_user: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  inactive_in_user: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  sequelize: dbConnection,  // Conexión a la base de datos
  tableName: 'user',
  timestamps: false
});

// Definir las asociaciones (relaciones)
User.belongsTo(Role, { foreignKey: 'id_role', as: 'role' });
User.belongsTo(Status, { foreignKey: 'id_status', as: 'status' });

export default User;
