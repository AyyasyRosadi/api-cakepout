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
import SharingProgram from "../service/apakah/sharingProgram/model"
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
import WeightQuestion from "../service/apakah/weigthActivity/modelQustion"
import WeightAnswer from "../service/apakah/weigthActivity/modelAnswer"
import WeightActivity from "../service/apakah/weigthActivity/model"
import Realization from "../service/apakah/realization/model"
import AccountAutomation from "../service/cakepout/accountAutomation/model"
import Santri from "../service/santri/santri/model";
import StatusSantri from "../service/santri/santri/model"


export const Synchronize = async () => {
    try {
        await db.authenticate()
        await Institution.sync()
        await Santri.sync();
        await StatusSantri.sync();
        await ProgramApakah.sync({ alter: true })
        await ComponentApakah.sync({ alter: true })
        await ActivityApakah.sync({ alter: true })
        await SubActivityApakah.sync({ alter: true })
        await InstitutionIncome.sync({ alter: true })
        await DetailOfActivity.sync({ alter: true })
        await SharingProgram.sync()
        await JournalReferenceNumber.sync({ alter: true })
        await GroupAccount.sync({ alter: true })
        await Account.sync({ alter: true })
        await Journal.sync({ alter: true })
        await Ledger.sync({ alter: true })
        await DisbursementOfFunds.sync({ alter: true })
        await InstanceApakah.sync({ alter: true })
        await IncomeGroup.sync({ alter: true })
        await Unit.sync({ alter: true })
        await YearActiveInSystem.sync({ alter: true })
        await WeightQuestion.sync({ alter: true })
        await WeightAnswer.sync({ alter: true })
        await WeightActivity.sync({ alter: true })
        await Realization.sync({ alter: true })
        await AccountAutomation.sync({alter:true})
    } catch (err) {
        throw err
    }
} 