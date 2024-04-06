import AccountingYear from "../service/accountingYear/model"
import Account from "../service/account/model"
import Activity from "../service/activity/model"
import BlacklistToken from "../service/blacklistToken/model"
import Component from "../service/component/model"
import DetailOfActivity from "../service/detailOfActivity/model"
import DisbursementOfFunds from "../service/disbursementOfFund/model"
import GroupAccount from "../service/groupAccount/model"
import Institution from "../service/institution/model"
import JournalReferenceNumber from "../service/journalReferenceNumber/model"
import Journal from "../service/journal/model"
import MonthlyAccountCalulation from "../service/monthlyAccountCalculation/model"
import Program from "../service/program/model"
import Ptk from "../service/ptk/model"
import Role from "../service/role/model"
import System from "../service/system/model"
import UserSystem from "../service/userSystem/model"
import User from "../service/user/model"
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