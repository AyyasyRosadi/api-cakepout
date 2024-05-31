import db from "../../config/database";
import { Optional, Model, DataTypes } from "sequelize";
import { LedgerAttributes } from "./dto";
import Account from "../account/model";

interface LedgerCreationAttributes extends Optional<LedgerAttributes, 'uuid'> { };
interface LedgerInstance extends Model<LedgerAttributes, LedgerCreationAttributes>, LedgerAttributes { };

const Ledger = db.define<LedgerInstance>('ledgers', {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    accounting_year: {
        type: DataTypes.STRING,
    },
    account_id: {
        type: DataTypes.STRING
    },
    month_index: {
        type: DataTypes.INTEGER
    },
    open: {
        type: DataTypes.BOOLEAN
    },
    total: {
        type: DataTypes.BIGINT
    }
})

Account.hasOne(Ledger, { foreignKey: 'account_id' })
Ledger.belongsTo(Account, { foreignKey: 'account_id' })

export default Ledger