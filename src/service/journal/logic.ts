import { Op } from "sequelize";
import Account from "../account/model";
import { JournalAttributes, JournalPaginationAttributes, AccountBegeningBalanceAttributes, SaveAccountBeginingBalance, AccountBegeningBalanceData } from "./dto";
import Journal from "./model";
import GroupAccount from "../groupAccount/model";
import time from "../../helper/time";
import accountingYear from "../../helper/accountingYear";
import journalReferenceNumber from "../../helper/journalReferenceNumber";
import monthlyAccountCalculation from "../../helper/monthlyAccountCalculation";
import { LogicBase, defaultMessage, messageAttribute } from "../logicBase";
import GroupAccountAttributes from "../groupAccount/dto";
import { AccountAttributes } from "../account/dto";


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
    private async getAccountByUuid(uuid: string): Promise<AccountAttributes | null> {
        const oneAccount = await Account.findOne({ where: { uuid } })
        return oneAccount
    }

    public async generateJournal(from_account: string, transaction_date: string, to_account: Array<{ account_id: string, amount: number }>): Promise<messageAttribute<defaultMessage>> {
        try {
            const activeYear = await accountingYear.getActiveAccountingYear()
            const oneAccount = await this.getAccountByUuid(from_account)
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

    private async getGroupAccountByNumberGroup(group_account: number): Promise<Array<GroupAccountAttributes>> {
        const groupAccount = await GroupAccount.findAll({
            where: {
                group_account,
            }, include: {
                model: Account,
                attributes: ['uuid', 'name', 'account_number',]
            },
            attributes: ['group_account', 'group_account_label', 'name']
        })

        return groupAccount
    }

    public async getAccountBeginingBalance(): Promise<messageAttribute<AccountBegeningBalanceAttributes>> {
        const accountBeginingBalance: AccountBegeningBalanceAttributes = {
            harta: await this.getGroupAccountByNumberGroup(1),
            kewajiban: await this.getGroupAccountByNumberGroup(2),
            modal: await this.getGroupAccountByNumberGroup(3)
        }
        return this.message(200, accountBeginingBalance)
    }

    private async cekAccountBeginingBalanceBeforeSave(data: Array<AccountBegeningBalanceData>, ref: string, month_index: number, accounting_year: string, date: Date, status: string): Promise<boolean> {

        for (const i of data) {
            const cekExist = await monthlyAccountCalculation.getActiveOneMonthlyAccountCalculation(month_index, accounting_year, i.id)
            if (!cekExist) {
                await monthlyAccountCalculation.createMonthlyAccountCalculation(month_index, accounting_year, i.id, i.value)
            }
            Journal.create({
                account_id: i.id,
                amount: i.value,
                accounting_year: accounting_year,
                reference: ref,
                transaction_date: date,
                status: status
            })

        }
        return true
    }

    public async saveAccountBeginingBalance(data: SaveAccountBeginingBalance): Promise<messageAttribute<defaultMessage>> {
        const ref = await journalReferenceNumber.generateReference()
        const yearActive = await accountingYear.getActiveAccountingYear()
        // if(data.account_balancing){

        // }

        const date = time.getPresentTime()

        this.cekAccountBeginingBalanceBeforeSave(data.harta, ref!, date.getMonth(), yearActive?.tahun!, date, 'D')
        this.cekAccountBeginingBalanceBeforeSave(data.kewajiban, ref!, date.getMonth(), yearActive?.tahun!, date, 'K')
        this.cekAccountBeginingBalanceBeforeSave(data.modal, ref!, date.getMonth(), yearActive?.tahun!, date, 'K')
        return this.message(200, { message: "saved" })
    }

}

export default new JournalLogic;