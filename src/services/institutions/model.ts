import db from "../../config/database";
import { DataTypes, Model } from "sequelize";
import InstitutionAttributes from "./dto";
import ProgramAttributes from "../programs/dto";
import Program from "../programs/model";

interface InstitutionInstance extends Model<InstitutionAttributes>, InstitutionAttributes {
    created_at: Date;
    updated_at: Date;
    programs: Array<ProgramAttributes>;
}

const Institution = db.define<InstitutionInstance>('list_lembaga', {
    no_lembaga: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    nama_lembaga: {
        type: DataTypes.STRING
    }
})

Institution.hasMany(Program, { foreignKey: 'no_lembaga' })
Program.belongsTo(Institution, { foreignKey: 'no_lembaga' })

export default Institution;