import Account from "../services/accounts/model"
import DetailOfActivity from "../services/detailOfActivities/model"
import DisbursementOfFunds from "../services/disbursementOfFunds/model"
import JournalReferenceNumber from "../services/journalReferenceNumbers/model"
import Journal from "../services/journals/model"
import MonthlyAccountCalulation from "../services/monthlyAccountCalculations/model"
import Ptk from "../services/ptk/model"
import db from "./database"

export const Synchronize = async () => {
    try {
        await db.authenticate()
        await Ptk.sync()
        await DetailOfActivity.sync()
        await JournalReferenceNumber.sync({ alter: true })
        await Account.sync({ alter: true })
        await Journal.sync({ alter: true })
        await MonthlyAccountCalulation.sync({ alter: true })
        await DisbursementOfFunds.sync({ alter: true })
    } catch (err) {
        throw err
    }
} 