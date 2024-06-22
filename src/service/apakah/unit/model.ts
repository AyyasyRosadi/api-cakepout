import { DataTypes, Model, Optional } from "sequelize";
import UnitAttributes from "./dto";
import db from "../../../config/database";


interface UnitCreationAttributes extends Optional<UnitAttributes, 'id'>{}
interface ProgramInstance extends Model<UnitAttributes, UnitCreationAttributes>, UnitAttributes{
    created_at:Date;
    updated_at:Date;
}

const Unit = db.define<ProgramInstance>("unit", {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
    }
})

export default Unit