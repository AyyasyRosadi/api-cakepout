import { DataTypes, Model, Optional } from "sequelize";
import {WeightQuestionAttributes} from "./dto"
import db from "../../../config/database";
import WeightAnswer from "./modelAnswer";
import WeightActivity from "./model";


interface WeightQuestionCreationAttributes extends Optional<WeightQuestionAttributes, 'id'>{}
interface WeightQuestion extends Model<WeightQuestionAttributes, WeightQuestionCreationAttributes>,WeightQuestionAttributes {
    created_at:Date;
    updated_at:Date;
}

const WeightQuestion = db.define<WeightQuestion>("weight_question", {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
       
    },
    question:{
        type:DataTypes.STRING,
    }
});

WeightQuestion.hasMany(WeightAnswer, {foreignKey:"weight_question_id"})
WeightAnswer.belongsTo(WeightQuestion, {foreignKey:"weight_question_id"})
WeightQuestion.hasOne(WeightActivity, {foreignKey:"weight_question_id"})
WeightAnswer.belongsTo(WeightQuestion, {foreignKey:"weight_question_id"})


export default  WeightQuestion