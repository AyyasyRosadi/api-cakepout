import { DataTypes, Model, Optional } from "sequelize";
import db from "../../../config/database";
import ActivityAttributes from "./dto";
import SubActivity from "../subActivity/model";
import DetailOfActivity from "../detailOfActivities/model";
import SubActivityAttributes from "../subActivity/dto";
import { DetailOfActivityAttributes } from "../detailOfActivities/dto";

interface ActivityCreationAttributes extends Optional<ActivityAttributes, 'id'>{}
interface ActivityInstance extends Model<ActivityAttributes, ActivityCreationAttributes>, ActivityAttributes{
    created_at:Date;
    updated_at:Date;
    sub_activity?:Array<SubActivityAttributes>
    detail_of_activity?:Array<DetailOfActivityAttributes>
}

const Activity = db.define<ActivityInstance>("activity",{
    id:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    activity_no:{
        type:DataTypes.INTEGER
    },
    name:{
        type:DataTypes.STRING
    },
    status:{
        type:DataTypes.INTEGER
    },
    component_id:{
        type:DataTypes.STRING
    },
    continue:{
        type:DataTypes.BOOLEAN
    },
    institution_no:{
        type:DataTypes.INTEGER
    },
    academic_year:{
        type:DataTypes.STRING
    },
    weight:{
        type:DataTypes.INTEGER,
        defaultValue:0
    }
}, {paranoid:true})

Activity.hasMany(SubActivity, {foreignKey:"activity_id"})
SubActivity.belongsTo(Activity,{foreignKey:"activity_id"})
Activity.hasMany(DetailOfActivity, {foreignKey:"activity_id"})
DetailOfActivity.belongsTo(Activity,  {foreignKey:"activity_id"})

export default Activity;