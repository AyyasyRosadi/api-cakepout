import { DataTypes, Model, Optional } from "sequelize";
import db from "../../config/database";
import {MonthlyAccountCalculationAttributes} from "./dto";
import Account from "../account/model";
import {AccountAttributes} from "../account/dto";

interface MonthlyAccountCalculationCreationAttributes extends Optional<MonthlyAccountCalculationAttributes, 'uuid'> { };
interface MonthlyAccountCalculationInstance extends Model<MonthlyAccountCalculationAttributes, MonthlyAccountCalculationCreationAttributes>, MonthlyAccountCalculationAttributes {
    created_at: Date;
    updated_at: Date;
    Account:AccountAttributes;
};

const MonthlyAccountCalulation = db.define<MonthlyAccountCalculationInstance>('monthly_account_calculations', {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    month_index: {
        type: DataTypes.INTEGER
    },
    accounting_year: {
        type: DataTypes.STRING
    },
    total: {
        type: DataTypes.BIGINT
    },
    account_id: {
        type: DataTypes.STRING
    },
    open: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
})

Account.hasMany(MonthlyAccountCalulation, { foreignKey: 'account_id' })
MonthlyAccountCalulation.belongsTo(Account, { foreignKey: 'account_id' })

export default MonthlyAccountCalulation