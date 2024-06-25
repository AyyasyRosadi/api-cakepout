import AccountingYear from "../service/accountingYear/model"
import Account from "../service/cakepout/account/model"
import BlacklistToken from "../service/blacklistToken/model"
import DisbursementOfFunds from "../service/cakepout/disbursementOfFund/model"
import GroupAccount from "../service/cakepout/groupAccount/model"
import Institution from "../service/institution/model"
import JournalReferenceNumber from "../service/cakepout/journalReferenceNumber/model"
import Journal from "../service/cakepout/journal/model"
import Ptk from "../service/ptk/model"
import Role from "../service/role/model"
import System from "../service/system/model"
import UserSystem from "../service/userSystem/model"
import User from "../service/user/model"
import db from "./database"
import SharingProgram from "../service/sharingProgram/model"
import Ledger from "../service/cakepout/ledger/model"
import InstanceApakah from "../service/apakah/instance/model"
import ProgramApakah from "../service/apakah/program/model"
import ComponentApakah from "../service/apakah/component/model"
import ActivityApakah from '../service/apakah/activity/model'
import SubActivityApakah from '../service/apakah/subActivity/model'
import DetailOfActivity from '../service/apakah/detailOfActivities/model'
import InstitutionIncome from "../service/apakah/institutionIncome/model"
import Unit from '../service/apakah/unit/model';
import IncomeGroup from "../service/apakah/incomeGroup/model"
import YearActiveInSystem from "../service/yearActiveInSystem/model"
import UserApakah from "../service/userApakah/model"


export const Synchronize = async () => {
    try {
        await db.authenticate()
        await Ptk.sync()
        await System.sync()
        await Role.sync()
        await User.sync()
        await Institution.sync()
        await UserSystem.sync()
        await ProgramApakah.sync({alter:true})
        await ComponentApakah.sync({alter:true})
        await ActivityApakah.sync({alter:true})
        await SubActivityApakah.sync({alter:true})
        await InstitutionIncome.sync({alter:true})
        await DetailOfActivity.sync({alter:true})
        await AccountingYear.sync()
        await SharingProgram.sync()
        await BlacklistToken.sync()
        await JournalReferenceNumber.sync({ alter: true })
        await GroupAccount.sync({ alter: true })
        await Account.sync({ alter: true })
        await Journal.sync({ alter: true })
        await Ledger.sync({ alter: true })
        await DisbursementOfFunds.sync({ alter: true })
        await InstanceApakah.sync({alter:true})
        await IncomeGroup.sync({alter:true})
        await Unit.sync({alter:true})
        await YearActiveInSystem.sync({alter:true})
        await UserApakah.sync()
    } catch (err) {
        throw err
    }
} 