import { DataTypes, Optional, Model } from "sequelize";
import db from "../../config/database";
import RoleAttributes from "./dto";
import SystemAttributes from "../systems/dto";

interface RoleCreationAttributes extends Optional<RoleAttributes, 'uuid'> { };
interface RoleInstance extends Model<RoleAttributes, RoleCreationAttributes>, RoleAttributes {
    sistem: SystemAttributes;
};

const Role = db.define<RoleInstance>('role', {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    nama_role: {
        type: DataTypes.STRING
    },
    uuid_sistem: {
        type: DataTypes.STRING
    }
})

export default Role