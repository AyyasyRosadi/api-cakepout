import { DataTypes, Model, Optional } from "sequelize";
import SubActivityAttributes from "./dto";
import db from "../../../config/database";

interface SubActivityCreationAttributes extends Optional<SubActivityAttributes, 'id'>{}
interface SubActivityInstance extends Model<SubActivityAttributes, SubActivityCreationAttributes>, SubActivityAttributes{
    created_at:Date;
    updated_at:Date;
}

const SubActivity = db.define<SubActivityInstance>("sub_activity", {
    id:{
        type:DataTypes.STRING,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    sub_activity_no: {
        type:DataTypes.INTEGER
    },
    name:{
        type:DataTypes.STRING
    },
    activity_id:{
        type:DataTypes.STRING
    }
})

export default SubActivity