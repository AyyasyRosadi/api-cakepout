import { DataTypes, Model, Optional } from "sequelize";
import db from "../../../config/database";
import ProgramAttributes from "./dto";
import Component from "../component/model";
import ComponentAttributes from "../component/dto";


interface ProgramCreationAttributes extends Optional<ProgramAttributes, 'id'>{}
interface ProgramInstance extends Model<ProgramAttributes, ProgramCreationAttributes>, ProgramAttributes{
    created_at:Date;
    updated_at:Date;
    component?:Array<ComponentAttributes>
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

Program.hasMany(Component, {foreignKey:"program_id"})
Component.belongsTo(Program, {foreignKey:"program_id"})

export default Program