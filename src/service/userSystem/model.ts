import { DataTypes, Optional, Model } from "sequelize";
import db from "../../config/database";
import UserSystemAttributes from "./dto";
import User from "../user/model";
import System from "../system/model";
import Role from "../role/model";
import SystemAttributes from "../system/dto";
import RoleAttributes from "../role/dto";
import UserAttributes from "../user/dto";

interface UserSystemCreationAttributes extends Optional<UserSystemAttributes, 'id'> { };
interface UserSystemInstance extends Model<UserSystemAttributes, UserSystemCreationAttributes>, UserSystemAttributes {
    sistem:SystemAttributes;
    role:RoleAttributes;
    user:UserAttributes;
};

const UserSystem = db.define<UserSystemInstance>('user_sistem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uuid_user: {
        type: DataTypes.STRING
    },
    uuid_sistem: {
        type: DataTypes.STRING
    },
    uuid_role: {
        type: DataTypes.STRING
    },
    super_admin: {
        type: DataTypes.BOOLEAN
    }
})

User.hasMany(UserSystem, { foreignKey: 'uuid_user' })
UserSystem.belongsTo(User, { foreignKey: 'uuid_user' })
System.hasMany(UserSystem, { foreignKey: 'user_sistem' })
UserSystem.belongsTo(System, { foreignKey: 'uuid_sistem' })
Role.hasMany(UserSystem, { foreignKey: 'uuid_role' })
UserSystem.belongsTo(Role, { foreignKey: 'uuid_role' })

export default UserSystem