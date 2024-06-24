import { DataTypes, Model, Optional } from "sequelize";
import InstitutionIncomeAttributes from "./dto";
import db from "../../../config/database";

interface InstitutionIncomeCreationAttributes extends Optional<InstitutionIncomeAttributes, 'id'>{}
interface InstitutionIncomeInstance extends Model<InstitutionIncomeAttributes, InstitutionIncomeCreationAttributes>, InstitutionIncomeAttributes{
    created_at:Date;
    updated_at:Date;
}

const InstitutionIncome = db.define<InstitutionIncomeInstance>("institution_income", {
    id: {
        type:DataTypes.STRING,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    institution_id:{
        type:DataTypes.INTEGER,
    },
    name:{
        type:DataTypes.STRING
    },
    academic_year: {
        type:DataTypes.STRING
    },
    total: {
        type:DataTypes.BIGINT
    },
    budgeted:{
        type:DataTypes.BIGINT
    },
    income_group_id:{
        type:DataTypes.STRING
    }
    
})

export default InstitutionIncome;