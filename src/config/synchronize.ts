import AccountingYear from "../services/accountingYears/model"
import Account from "../services/accounts/model"
import Activity from "../services/activities/model"
import BlacklistToken from "../services/blacklistTokens/model"
import Component from "../services/components/model"
import DetailOfActivity from "../services/detailOfActivities/model"
import DisbursementOfFunds from "../services/disbursementOfFunds/model"
import GroupAccount from "../services/groupAccounts/model"
import Institution from "../services/institutions/model"
import JournalReferenceNumber from "../services/journalReferenceNumbers/model"
import Journal from "../services/journals/model"
import MonthlyAccountCalulation from "../services/monthlyAccountCalculations/model"
import Program from "../services/programs/model"
import Ptk from "../services/ptk/model"
import Role from "../services/roles/model"
import System from "../services/systems/model"
import UserSystem from "../services/userSystems/model"
import User from "../services/users/model"
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