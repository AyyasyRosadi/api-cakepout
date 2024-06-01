import {  DataTypes, Model, Optional } from "sequelize";
import db from "../../config/database";
import { AccountAttributes } from "./dto";
import DetailOfActivity from "../detailOfActivity/model";
import DetailOfActivityAttributes from "../detailOfActivity/dto";
import { JournalAttributes } from "../journal/dto";
import Journal from "../journal/model";

interface AccountCreationsAttributes extends Optional<AccountAttributes, 'uuid' | 'activity_id'> { };
interface AccountInstance extends Model<AccountAttributes, AccountCreationsAttributes>, AccountAttributes {
    created_at: Date;
    updated_at: Date;
    DetailOfActivity: DetailOfActivityAttributes;
    Journals: Array<JournalAttributes>
};

const Account = db.define<AccountInstance>('accounts', {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING
    },
    group_account_id: {
        type: DataTypes.STRING
    },
    account_number: {
        type: DataTypes.STRING
    },
    activity_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    asset:{
        type:DataTypes.BOOLEAN
    }
   
})

DetailOfActivity.hasMany(Account, { foreignKey: 'activity_id', as: 'account' })
Account.belongsTo(DetailOfActivity, { foreignKey: 'activity_id', as: 'detail_of_activity' })
// Account.hasMany(Journal, {foreignKey:"account_id"})
// Journal.belongsTo(Account, {foreignKey:"account_id"})


export default Account