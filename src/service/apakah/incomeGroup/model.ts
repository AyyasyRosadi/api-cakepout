import { DataTypes, Model, Optional } from "sequelize";
import IncomeGroupAttributes from "./dto";
import db from "../../../config/database";


interface IncomeGroutCreationAttributes extends Optional<IncomeGroupAttributes, 'id'>{}
interface IncomeGroupInstance extends Model<IncomeGroupAttributes, IncomeGroutCreationAttributes>, IncomeGroupAttributes{
    created_at:Date;
    updated_at:Date;
}

const IncomeGroup = db.define<IncomeGroupInstance>('income_groups', {
    id:{
        type:DataTypes.STRING,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
    },
    parent_id:{
        type:DataTypes.INTEGER
    }
})

export default IncomeGroup;