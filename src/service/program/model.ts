import db from "../../config/database";
import { DataTypes, Model } from "sequelize";
import ProgramAttributes from "./dto";
import ComponentAttributes from "../component/dto";
import Component from "../component/model";

interface ProgramInstance extends Model<ProgramAttributes>, ProgramAttributes {
    created_at: Date;
    updated_at: Date;
    list_komponen: Array<ComponentAttributes>;
}

const Program = db.define<ProgramInstance>('list_program', {
    no_program: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    item_program: {
        type: DataTypes.STRING
    },
    modifiable: {
        type: DataTypes.BOOLEAN
    },
    no_lembaga: {
        type: DataTypes.INTEGER
    }
})

Program.hasMany(Component, { foreignKey: 'no_program' })
Component.belongsTo(Program, { foreignKey: 'no_program' })

export default Program