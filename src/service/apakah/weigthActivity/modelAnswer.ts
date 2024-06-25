import { DataTypes, Model, Optional } from "sequelize";
import {WeightAnswerAttributes} from "./dto"
import db from "../../../config/database";


interface WeightAnswerCreationAttributes extends Optional<WeightAnswerAttributes, 'id'>{}
interface WeightAnswerInstance extends Model<WeightAnswerAttributes, WeightAnswerCreationAttributes>,WeightAnswerAttributes {
    created_at:Date;
    updated_at:Date;
}

const WeightAnswer = db.define<WeightAnswerInstance>("weight_answer", {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true ,
        autoIncrement:true
    },
    answer:{
        type:DataTypes.STRING,
    },
    weight_question_id:{
        type:DataTypes.INTEGER
    },
    weight:{
        type:DataTypes.INTEGER
    }
});

export default  WeightAnswer