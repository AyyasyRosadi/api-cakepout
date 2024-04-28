import { DataTypes, Model, Optional } from "sequelize";
import db from "../../config/database";
import { JournalAttributes } from "./dto";
import Account from "../account/model";
import { AccountAttributes } from "../account/dto";

interface JournalCreationAttributes extends Optional<JournalAttributes, 'uuid'> { };
interface JournalInstance extends Model<JournalAttributes, JournalCreationAttributes>, JournalAttributes {
    created_at: Date;
    updated_at: Date;
    Account: AccountAttributes;
};

const Journal = db.define<JournalInstance>('journals', {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    reference: {
        type: DataTypes.STRING
    },
    transaction_date: {
        type: DataTypes.DATEONLY
    },
    amount: {
        type: DataTypes.BIGINT
    },
    status: {
        type: DataTypes.STRING(1)
    },
    accounting_year: {
        type: DataTypes.STRING
    },
    account_id: {
        type: DataTypes.STRING
    }
})

Account.hasMany(Journal, { foreignKey: 'account_id' })
Journal.belongsTo(Account, { foreignKey: 'account_id' })


export default Journal