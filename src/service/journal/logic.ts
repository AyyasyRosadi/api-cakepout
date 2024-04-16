import { Op } from "sequelize";
import Account from "../account/model";
import JournalAttributes from "./dto";
import Journal from "./model";
import { ActionAttributes } from "../interfaces";
import message from "../../helper/message";
import account from "../../helper/account";
import GroupAccount from "../groupAccount/model";
import time from "../../helper/time";
import accountingYear from "../../helper/accountingYear";
import journalReferenceNumber from "../../helper/journalReferenceNumber";
import monthlyAccountCalculation from "../../helper/monthlyAccountCalculation";

interface JournalPaginationAttributes {
    page: number;
    totalPages: number;
    totalItems: number;
    data: Array<JournalAttributes>;
}

class JournalLogic {
    public async getAllJournal(page: number, size: number): Promise<JournalPaginationAttributes> {
        const offset = (page - 1) * size
        const allJournal = await Journal.findAndCountAll(
            {
                limit: size,
                offset: offset,
                include: [{ model: Account, include: [{ model: GroupAccount }] }],
                order: [["transaction_date", "DESC"], ['amount', 'DESC']]
            }
        )
        return {
            page,
            totalPages: Math.ceil(allJournal.count / size),
            totalItems: allJournal.count,
            data: allJournal.rows
        }
    }
    public async getJournalByUuid(uuid: string): Promise<JournalAttributes | null> {
        const oneJournal = await Journal.findOne({ where: { uuid }, include: { model: Account } })
        return oneJournal
    }
    public async getJournalByStatus(status: string): Promise<Array<JournalAttributes>> {
        const allJournal = await Journal.findAll({ where: { status }, include: { model: Account } })
        return allJournal
    }
    public async getJournalByTransactionDate(start: string, end: string): Promise<Array<JournalAttributes>> {
        const allJournal = await Journal.findAll({ where: { transaction_date: { [Op.gte]: start, [Op.lte]: end } }, include: { model: Account } })
        return allJournal
    }
    public async getJournalByYear(year: string): Promise<Array<JournalAttributes>> {
        const allJournal = await Journal.findAll({ where: { accounting_year: year }, include: { model: Account } })
        return allJournal
    }
    public async getJournalByAccountId(accountId: string): Promise<Array<JournalAttributes>> {
        const allJournal = await Journal.findAll({ where: { account_id: accountId }, include: { model: Account } })
        return allJournal
    }
    private async createJournal(amount: number, status: "K" | "D", account_id: string, reference: string, transaction_date: Date, year: string): Promise<boolean> {
        try {
            await Journal.create({ transaction_date, account_id: account_id, accounting_year: year, amount: amount, reference: reference, status: status })
            return true
        } catch {
            return false
        }
    }
    public async generateJournal(from_account: string, to_account: Array<{ account_id: string, amount: number, transaction_date: string }>): Promise<ActionAttributes> {
        try {
            const activeYear = await accountingYear.getActiveAccountingYear()
            const oneAccount = await account.getAccountByUuid(from_account)
            let rejectAccount = ''
            if (!oneAccount) {
                return message.sendMessage(false)
            }
            for (let i in to_account) {
                const transactionDate = time.date(to_account[i].transaction_date)
                const fromOneMonthlyAccountCalculation = await monthlyAccountCalculation.getActiveOneMonthlyAccountCalculation(transactionDate.getMonth(), activeYear!.tahun, oneAccount.uuid)
                const toOneMonthlyAccountCalculation = await monthlyAccountCalculation.getActiveOneMonthlyAccountCalculation(transactionDate.getMonth(), activeYear!.tahun, to_account[i].account_id)
                if (!fromOneMonthlyAccountCalculation) {
                    return message.sendMessage(false, 'kalkulasi akun sumber sudah ditutup')
                }
                if (toOneMonthlyAccountCalculation) {
                    const referenceNumber = await journalReferenceNumber.generateReference()
                    if (oneAccount.group_account?.group_account === 1 || oneAccount.group_account?.group_account === 4) {
                        await this.createJournal(to_account[i].amount, 'K', oneAccount.uuid, referenceNumber!, transactionDate, activeYear!.tahun)
                        await monthlyAccountCalculation.updateTotalMonthlyAccountCalculation((fromOneMonthlyAccountCalculation.total - to_account[i].amount), fromOneMonthlyAccountCalculation.uuid)
                        await this.createJournal(to_account[i].amount, 'D', to_account[i].account_id, referenceNumber!, transactionDate, activeYear!.tahun)
                        await monthlyAccountCalculation.updateTotalMonthlyAccountCalculation((toOneMonthlyAccountCalculation.total + to_account[i].amount), toOneMonthlyAccountCalculation.uuid)
                    } else {
                        await this.createJournal(to_account[i].amount, 'D', oneAccount.uuid, referenceNumber!, transactionDate, activeYear!.tahun)
                        await monthlyAccountCalculation.updateTotalMonthlyAccountCalculation((fromOneMonthlyAccountCalculation.total + to_account[i].amount), fromOneMonthlyAccountCalculation.uuid)
                        await this.createJournal(to_account[i].amount, 'K', to_account[i].account_id, referenceNumber!, transactionDate, activeYear!.tahun)
                        await monthlyAccountCalculation.updateTotalMonthlyAccountCalculation((toOneMonthlyAccountCalculation.total - to_account[i].amount), toOneMonthlyAccountCalculation.uuid)
                    }
                } else {
                    const toAccount = await account.getAccountByUuid(to_account[i].account_id)
                    rejectAccount += toAccount?.name
                }
            }
            return rejectAccount.length > 0 ?
                message.sendMessage(true, `kalkulasi akun tujuan sudah ditutup untuk akun ${rejectAccount}`)
                :
                message.sendMessage(true)
        } catch (r) {
            return message.sendMessage(false)
        }
    }
}

export default new JournalLogic;