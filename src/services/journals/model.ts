import { DataTypes, Model, Optional } from "sequelize";
import db from "../../config/database";
import JournalAttributes from "./dto";
import Account from "../accounts/model";

interface JournalCreationAttributes extends Optional<JournalAttributes,'uuid'>{};
interface JournalInstance extends Model<JournalAttributes,JournalCreationAttributes>,JournalAttributes{};

const Journal = db.define<JournalInstance>('journal',{
    uuid:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    reference:{
        type:DataTypes.STRING
    },
    transaction_date:{
        type:DataTypes.DATE
    },
    amount:{
        type:DataTypes.BIGINT
    },
    status:{
        type:DataTypes.STRING(1)
    },
    accounting_year:{
        type:DataTypes.STRING
    },
    account_id:{
        type:DataTypes.STRING
    }
})

Account.hasMany(Journal,{foreignKey:'account_id'})
Journal.belongsTo(Account,{foreignKey:'account_id'})


export default Journal