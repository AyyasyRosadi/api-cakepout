import { DataTypes,Optional,Model } from "sequelize";
import db from "../../config/database";
import UserAttributes from "./dto";
import UserSystemAttributes from "../userSystem/dto";

interface UserCreationAttributes extends Optional<UserAttributes,'uuid'>{};
interface UserInstance extends Model<UserAttributes,UserCreationAttributes>,UserAttributes{
    userSystems:Array<UserSystemAttributes>;
}

const User = db.define<UserInstance>('user',{
    uuid:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    nama:{
        type:DataTypes.STRING
    },
    username:{
        type:DataTypes.STRING
    },
    password:{
        type:DataTypes.STRING
    },
    general_user:{
        type:DataTypes.BOOLEAN
    }
},{
    indexes:[{
        unique:true,
        fields:['username']
    }],
    paranoid:true
})

export default User