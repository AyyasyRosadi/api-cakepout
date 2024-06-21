import db from "../../config/database";
import { DataTypes, Model, Optional } from "sequelize";
import InstitutionAttributes from "./dto";
import ProgramAttributes from "../apakah/program/dto";
import Program from "../apakah/program/model";

interface InstitutionCreationAttributes extends Optional<InstitutionAttributes, 'id'>{}
interface InstitutionInstance extends Model<InstitutionAttributes, InstitutionCreationAttributes>, InstitutionAttributes {
    created_at: Date;
    updated_at: Date;
    programs: Array<ProgramAttributes>;
}

const Institution = db.define<InstitutionInstance>('institution', {
   id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true
        
    },
   name: {
        type: DataTypes.STRING
    }
})

Institution.hasMany(Program, { foreignKey: 'institution_no' })
Program.belongsTo(Institution, { foreignKey: 'institution_no' })

export default Institution;