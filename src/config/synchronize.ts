import AccountingYear from "../service/accountingYears/model"
import Account from "../service/accounts/model"
import Activity from "../service/activities/model"
import BlacklistToken from "../service/blacklistTokens/model"
import Component from "../service/components/model"
import DetailOfActivity from "../service/detailOfActivities/model"
import DisbursementOfFunds from "../service/disbursementOfFunds/model"
import GroupAccount from "../service/groupAccounts/model"
import Institution from "../service/institutions/model"
import JournalReferenceNumber from "../service/journalReferenceNumbers/model"
import Journal from "../service/journals/model"
import MonthlyAccountCalulation from "../service/monthlyAccountCalculations/model"
import Program from "../service/programs/model"
import Ptk from "../service/ptk/model"
import Role from "../service/roles/model"
import System from "../service/systems/model"
import UserSystem from "../service/userSystems/model"
import User from "../service/users/model"
import db from "./database"

export const Synchronize = async () => {
    try {
        await db.authenticate()
        await Ptk.sync()
        await System.sync()
        await Role.sync()
        await User.sync()
        await UserSystem.sync()
        await AccountingYear.sync()
        await Institution.sync()
        await Program.sync()
        await Component.sync()
        await Activity.sync()
        await DetailOfActivity.sync()
        await BlacklistToken.sync()
        await JournalReferenceNumber.sync({ alter: true })
        await GroupAccount.sync({ alter: true })
        await Account.sync({ alter: true })
        await Journal.sync({ alter: true })
        await MonthlyAccountCalulation.sync({ alter: true })
        await DisbursementOfFunds.sync({ alter: true })
    } catch (err) {
        throw err
    }
} 