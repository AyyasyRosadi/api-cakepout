import db from "../../../config/database";
import { DataTypes, Model, Optional } from "sequelize";
import GroupAccountAttributes from "./dto";
import Account from "../account/model";
import { AccountAttributes } from "../account/dto";


interface GroupAccountCreationAttributes extends Optional<GroupAccountAttributes, 'uuid'> { };
interface GroupAccountInstance extends Model<GroupAccountAttributes, GroupAccountCreationAttributes>, GroupAccountAttributes {
    account: AccountAttributes[];
    created_at: Date;
    updated_at: Date;
}

const GroupAccount = db.define<GroupAccountInstance>('group_accounts', {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    group_account: {
        type: DataTypes.INTEGER
    },
    group_account_label: {
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    }
})

GroupAccount.hasMany(Account, { foreignKey: 'group_account_id', as:"account" })
Account.belongsTo(GroupAccount, { foreignKey: 'group_account_id' })

export default GroupAccount