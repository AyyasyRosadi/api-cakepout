import { Op } from "sequelize";
import Account from "../account/model";
import {JournalAttributes, JournalPaginationAttributes, AccountBegeningBalanceAttributes} from "./dto";
import Journal from "./model";
import account from "../../helper/account";
import GroupAccount from "../groupAccount/model";
import time from "../../helper/time";
import accountingYear from "../../helper/accountingYear";
import journalReferenceNumber from "../../helper/journalReferenceNumber";
import monthlyAccountCalculation from "../../helper/monthlyAccountCalculation";
import { LogicBase, defaultMessage, messageAttribute } from "../logicBase";
import AccountAttributes from "../account/dto";
import AccountLogic from '../account/logic'


class JournalLogic extends LogicBase {
    private async accumulateDebitNKredit(data: Array<JournalAttributes>): Promise<{ debit: number, kredit: number }> {
        let debit = 0
        let kredit = 0
        for (let i in data) {
            if (data[i].status === 'K') {
                kredit += data[i].amount
            } else {
                debit += data[i].amount
            }
        }
        return { debit, kredit }
    }
    public async getAllJournal(page: number, size: number, fromDate: string, toDate: string): Promise<messageAttribute<JournalPaginationAttributes>> {
        const offset = (page - 1) * size
        const filterJournal = fromDate !== "-" && toDate !== "-" ? { transaction_date: { [Op.between]: [fromDate, toDate] } } : { transaction_date: 0 }
        const allJournal = await Journal.findAndCountAll(
            {
                limit: size,
                offset: offset,
                include: [{ model: Account, include: [{ model: GroupAccount }] }],
                where: filterJournal,
                order: [["transaction_date", "DESC"]]
            }
        )
        const accumulate = await this.accumulateDebitNKredit(allJournal.rows)
        return this.message(200, {
            page,
            totalPages: Math.ceil(allJournal.count / size),
            totalItems: allJournal.count,
            data: allJournal.rows,
            debit: accumulate.debit,
            kredit: accumulate.kredit
        })
    }
    public async getJournalByUuid(uuid: string): Promise<messageAttribute<JournalAttributes | defaultMessage>> {
        const oneJournal = await Journal.findOne({ where: { uuid }, include: { model: Account } })
        return this.message(oneJournal ? 200 : 404, oneJournal ? oneJournal : { message: "Journal tidak ditemukan" })
    }
    public async getJournalByStatus(status: string): Promise<messageAttribute<Array<JournalAttributes>>> {
        const allJournal = await Journal.findAll({ where: { status }, include: { model: Account } })
        return this.message(200, allJournal)
    }
    public async getJournalByTransactionDate(start: string, end: string): Promise<messageAttribute<Array<JournalAttributes>>> {
        const allJournal = await Journal.findAll({ where: { transaction_date: { [Op.gte]: start, [Op.lte]: end } }, include: { model: Account } })
        return this.message(200, allJournal)
    }
    public async getJournalByYear(year: string): Promise<messageAttribute<Array<JournalAttributes>>> {
        const allJournal = await Journal.findAll({ where: { accounting_year: year }, include: { model: Account } })
        return this.message(200, allJournal)
    }
    public async getJournalByAccountId(accountId: string): Promise<messageAttribute<Array<JournalAttributes>>> {
        const allJournal = await Journal.findAll({ where: { account_id: accountId }, include: { model: Account } })
        return this.message(200, allJournal)
    }
    private async createJournal(amount: number, status: "K" | "D", account_id: string, reference: string, transaction_date: Date, year: string): Promise<boolean> {
        try {
            await Journal.create({ transaction_date, account_id: account_id, accounting_year: year, amount: amount, reference: reference, status: status })
            return true
        } catch {
            return false
        }
    }
    public async generateJournal(from_account: string, transaction_date: string, to_account: Array<{ account_id: string, amount: number }>): Promise<messageAttribute<defaultMessage>> {
        try {
            const activeYear = await accountingYear.getActiveAccountingYear()
            const oneAccount = await account.getAccountByUuid(from_account)
            const transactionDate = time.date(transaction_date)
            const fromOneMonthlyAccountCalculation = await monthlyAccountCalculation.getActiveOneMonthlyAccountCalculation(transactionDate.getMonth(), activeYear!.tahun, oneAccount!.uuid)
            if (!fromOneMonthlyAccountCalculation) {
                return this.message(403, { message: "Kalkulasi akun sumber belum dibuka" })
            }
            let finalAmount = 0
            const referenceNumber = await journalReferenceNumber.generateReference()
            for (let i in to_account) {
                const toOneMonthlyAccountCalculation = await monthlyAccountCalculation.getActiveOneMonthlyAccountCalculation(transactionDate.getMonth(), activeYear!.tahun, to_account[i].account_id)
                if (!toOneMonthlyAccountCalculation) {
                    return this.message(403, { message: `Kalkulasi akun tujuan belum dibuka` })
                }
                if (oneAccount!.group_account?.group_account === 1 || oneAccount!.group_account?.group_account === 4) {
                    await this.createJournal(to_account[i].amount, 'D', to_account[i].account_id, referenceNumber!, transactionDate, activeYear!.tahun)

                    if (oneAccount!.group_account?.group_account === 1 && (fromOneMonthlyAccountCalculation.total - to_account[i].amount) < 0) {
                        return this.message(403, { message: "Maaf journal tidak tercatat karena saldo tidak mencukupi" })
                    } else if (oneAccount!.group_account?.group_account === 1) {
                        await monthlyAccountCalculation.updateTotalMonthlyAccountCalculation((fromOneMonthlyAccountCalculation.total - to_account[i].amount), fromOneMonthlyAccountCalculation.uuid)
                    }
                    await monthlyAccountCalculation.updateTotalMonthlyAccountCalculation((toOneMonthlyAccountCalculation!.total + to_account[i].amount), toOneMonthlyAccountCalculation!.uuid)

                    finalAmount += to_account[i].amount
                }
            }
            await this.createJournal(finalAmount, 'K', oneAccount!.uuid, referenceNumber!, transactionDate, activeYear!.tahun)

            return this.message(200, { message: "Succes" })
        } catch (r) {
            return this.message(403, { message: "Gagal" })
        }
    }

    // public async getAccountBeginningBalance():Promise<messageAttribute<Array<AccountAttributes>>>{
        // const harta = await AccountLogic.getAccountByAccountNumber(1)
        // return this.message(200, [])
    // }
}

export default new JournalLogic;