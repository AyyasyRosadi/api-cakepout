import { DataTypes, Model, Optional } from "sequelize";
import db from "../../../config/database";
import AccountAutomationAttributes from "./dto";


interface AccountAutomationCreationAttributes extends Optional<AccountAutomationAttributes,"uuid">{}
interface AccountAutomationInstance extends Model<AccountAutomationAttributes, AccountAutomationCreationAttributes>, AccountAutomationAttributes{
    createdAt:Date;
    updatedAt:Date;
}

const AccountAutomation = db.define<AccountAutomationInstance>("account_automations",{
    uuid:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue: DataTypes.UUIDV4
    },
    uuid_account_from:{
        type:DataTypes.STRING
    },
    uuid_account_to:{
        type:DataTypes.STRING
    },
    role:{
        type:DataTypes.STRING
    }
})

export default AccountAutomation;