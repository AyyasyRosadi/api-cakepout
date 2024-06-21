import { DataTypes, Model, Optional } from "sequelize";
import db from "../../../config/database";
import ProgramAttributes from "./dto";


interface ProgramCreationAttributes extends Optional<ProgramAttributes, 'id'>{}
interface ProgramInstance extends Model<ProgramAttributes, ProgramCreationAttributes>, ProgramAttributes{
    created_at:Date;
    updated_at:Date;
}

const Program  = db.define<ProgramInstance>('program', {
    id:{
        type:DataTypes.STRING,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    institution_no:{
        type:DataTypes.INTEGER,
    },
    program_no:{
        type:DataTypes.INTEGER,
    },
    item:{
        type:DataTypes.STRING,
    },
    modifable:{
        type:DataTypes.BOOLEAN
    }
})

export default Program