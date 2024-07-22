import { DataTypes, Model, Optional } from "sequelize";
import db from "../../../config/database";
import { SharingProgramAttributes } from "./dto";

interface SharingProgramCreationAttriutes extends Optional<SharingProgramAttributes, 'uuid'> { }
interface SharingProgramInstance extends Model<SharingProgramAttributes, SharingProgramCreationAttriutes>, SharingProgramAttributes { }

const SharingProgram = db.define<SharingProgramInstance>('sharing_programs', {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING
    }
})

export default SharingProgram