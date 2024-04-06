import { DataTypes, Model, Optional } from "sequelize";
import AccountAttributes from "../account/dto";
import db from "../../config/database";
import AccountingYearAttributes from "./dto";

// interface AccountingYearCreationAttributes extends Optional<AccountingYearAttributes, 'id'> { }
interface AccountingYearInstance extends Model<AccountingYearAttributes>, AccountingYearAttributes {
    created_at: Date;
    updated_at: Date;
}

const AccountingYear = db.define<AccountingYearInstance>('listTahun', {
    tahun: {
        type: DataTypes.STRING
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

export default AccountingYear;