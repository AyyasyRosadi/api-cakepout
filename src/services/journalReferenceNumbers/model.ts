import { DataTypes, Model, Optional } from "sequelize";
import db from "../../config/database";
import JournalReferenceNumberAttributes from "./dto";

interface JournalReferenceNumberCreationAttributes extends Optional<JournalReferenceNumberAttributes,'uuid'>{};
interface JournalReferenceNumberInstance extends Model<JournalReferenceNumberAttributes,JournalReferenceNumberCreationAttributes>,JournalReferenceNumberAttributes{};

const JournalReferenceNumber = db.define<JournalReferenceNumberInstance>('journal_reference_number',{
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