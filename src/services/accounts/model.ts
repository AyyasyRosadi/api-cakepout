import { DataTypes, Model, Optional } from "sequelize";
import db from "../../config/database";
import AccountAttributes from "./dto";
import DetailOfActivity from "../detailOfActivities/model";
import DetailOfActivityAttributes from "../detailOfActivities/dto";
import JournalAttributes from "../journals/dto";

interface AccountCreationsAttributes extends Optional<AccountAttributes, 'uuid'> { };
interface AccountInstance extends Model<AccountAttributes, AccountCreationsAttributes>, AccountAttributes {
    created_at: Date;
    updated_at: Date;
    DetailOfActivity: DetailOfActivityAttributes;
    Journals: Array<JournalAttributes>
};

const Account = db.define<AccountInstance>('account', {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING
    },
    group_account: {
        type: DataTypes.INTEGER,
    },
    group_account_label: {
        type: DataTypes.INTEGER
    },
    account_number: {
        type: DataTypes.STRING
    },
    activity_id: {
        type: DataTypes.STRING
    }
})

DetailOfActivity.hasOne(Account, { foreignKey: 'activity_id', as: 'detail_of_activity' })
Account.belongsTo(DetailOfActivity, { foreignKey: 'activity_id', as: 'account' })


export default Account