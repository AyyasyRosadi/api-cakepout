import { UserApakahAttributes } from "./dto";
import db from "../../config/database";
import { DataTypes,Optional,Model } from "sequelize";
import User from "../user/model";

interface UserApakahCreationAttributes extends Optional<UserApakahAttributes,'id'>{};
interface UserApakahInstance extends Model<UserApakahAttributes,UserApakahCreationAttributes>,UserApakahAttributes{}

const UserApakah = db.define<UserApakahInstance>('user_lembaga_apakah',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    uuid_user:{
        type:DataTypes.STRING,
    },
    no_lembaga:{
        type:DataTypes.INTEGER
    },
    uuid_sistem:{
        type:DataTypes.STRING
    }
})

User.hasOne(UserApakah,{foreignKey:'uuid_user',as:"user_apakah"})
UserApakah.belongsTo(User,{foreignKey:'uuid_user',as:"user"})

export default UserApakah