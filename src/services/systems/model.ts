import { DataTypes,Optional,Model } from "sequelize";
import db from "../../config/database";
import SystemAttributes from "./dto";
import Role from "../roles/model";
import RoleAttributes from "../roles/dto";

interface SystemCreationAttributes extends Optional<SystemAttributes,'uuid'>{};
interface SystemInstance extends Model<SystemAttributes,SystemCreationAttributes>,SystemAttributes{
    roles:Array<RoleAttributes>
};

const System = db.define<SystemInstance>('sistem',{
    uuid:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    nama_sistem:{
        type:DataTypes.STRING
    }
})

System.hasMany(Role,{foreignKey:'uuid_sistem'})
Role.belongsTo(System,{foreignKey:'uuid_sistem'})

export default System