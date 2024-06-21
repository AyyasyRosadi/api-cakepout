import { DataTypes, Model, Optional } from "sequelize";
import db from "../../../config/database";
import JournalReferenceNumberAttributes from "./dto";

interface JournalReferenceNumberCreationAttributes extends Optional<JournalReferenceNumberAttributes,'uuid'>{};
interface JournalReferenceNumberInstance extends Model<JournalReferenceNumberAttributes,JournalReferenceNumberCreationAttributes>,JournalReferenceNumberAttributes{
    created_at:Date;
    updated_at:Date;
};

const JournalReferenceNumber = db.define<JournalReferenceNumberInstance>('journal_reference_numbers',{
    uuid:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    number:{
        type:DataTypes.INTEGER
    },
    accounting_year:{
        type:DataTypes.STRING
    }
})

export default JournalReferenceNumber