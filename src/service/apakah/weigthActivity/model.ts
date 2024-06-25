import { DataTypes, Model, Optional } from "sequelize";
import WeightActivityAttributes from "./dto"
import db from "../../../config/database";
import WeightQuestion from "./modelQustion";
import WeightAnswer from "./modelAnswer";


interface WeightActivityCreationAttributes extends Optional<WeightActivityAttributes, 'id'>{}
interface WeightActivityInstance extends Model<WeightActivityAttributes, WeightActivityCreationAttributes>,WeightActivityAttributes {
    created_at:Date;
    updated_at:Date;
}


const WeightActivity = db.define<WeightActivityInstance>("weight_activity", {
    id:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    activity_id:{
        type:DataTypes.STRING,
    },
    weight_question_id:{
        type:DataTypes.INTEGER
    },
    weight_answer_id:{
        type:DataTypes.INTEGER
    }
})

WeightAnswer.hasOne(WeightActivity, {foreignKey:"weight_answer_id"})
WeightActivity.belongsTo(WeightAnswer, {foreignKey:"weight_answer_id"})





export default WeightActivity;