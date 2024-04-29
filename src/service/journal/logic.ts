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
import disbursementOfFund from "../../helper/disbursementOfFund";
import account from "../../helper/account";
import { MonthlyAccountCalculationAttributes } from "../monthlyAccountCalculation/dto";
import DisbursementOfFunds from "../disbursementOfFund/model";
import DetailOfActivityAttributes from "../detailOfActivity/dto";
import MonthlyAccountCalulation from "../monthlyAccountCalculation/model";


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
        const filterJournal = fromDate !== "" && toDate !== "" ? { transaction_date: { [Op.between]: [fromDate, toDate] } } : { transaction_date: 0 }
        const allJournal = await Journal.findAndCountAll(
            {
                limit: size,
                offset: offset,
                include: [{ model: Account, include: [{ model: GroupAccount }] }],
                where: filterJournal,
                order: [["transaction_date", "DESC"], ['createdAt', "DESC"]]
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
    private async checkAndUpdateMontlyAccountCalculationValue(fromAccount: AccountAttributes, fromOneMonthlyAccountCalculation: MonthlyAccountCalculationAttributes, toAccount: { amount: number, account_id: string }): Promise<boolean> {
        if (fromAccount!.group_account?.group_account === 1 && (fromOneMonthlyAccountCalculation.total - toAccount.amount) < 0) {
            return false
        } else if (fromAccount!.group_account?.group_account === 1) {
            await monthlyAccountCalculation.updateTotalMonthlyAccountCalculation((fromOneMonthlyAccountCalculation.total - toAccount.amount), fromOneMonthlyAccountCalculation.uuid)
        }
        return true
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
                    const checkMonthlyAccountCalculation = await this.checkAndUpdateMontlyAccountCalculationValue(oneAccount!, fromOneMonthlyAccountCalculation, to_account[i])
                    if (!checkMonthlyAccountCalculation) {
                        return this.message(403, { message: "Gagal" })
                    }
                    await monthlyAccountCalculation.updateTotalMonthlyAccountCalculation((toOneMonthlyAccountCalculation!.total + to_account[i].amount), toOneMonthlyAccountCalculation!.uuid)

                    await this.createJournal(to_account[i].amount, 'D', to_account[i].account_id, referenceNumber!, transactionDate, activeYear!.tahun)
                    finalAmount += to_account[i].amount
                }
            }
            await this.createJournal(finalAmount, 'K', oneAccount!.uuid, referenceNumber!, transactionDate, activeYear!.tahun)

            return this.message(200, { message: "Succes" })
        } catch (r) {
            return this.message(403, { message: "Gagal" })
        }
    }
    private async approveWithDrawDisbursementOfFund(uuid: string, ptk_id: string | null, recipient: string | null): Promise<messageAttribute<defaultMessage>> {
        try {
            await DisbursementOfFunds.update({ withdraw: true, ptk_id: ptk_id, recipient: recipient }, { where: { uuid } })
            return this.message(200, { message: "Succes" })
        } catch (_) {
            return this.message(403, { message: "Gagal" })
        }
    }

    private async createJournalDisbursementOfFund(fromAccount: AccountAttributes, fromOneMonthlyAccountCalculation: MonthlyAccountCalculationAttributes, activity: DetailOfActivityAttributes, transactionDate: Date, year: string, disbursement_of_fund_id: string, amount: number, referenceNumber: string, ptk_id: string | null, recepient: string | null): Promise<messageAttribute<defaultMessage>> {
        try {
            let toAccount = await account.getAccountByActivity(activity.uuid)
            if (!toAccount) {
                await account.generateAccount(activity.uraian, 5, 0, activity.uuid, activity.uraian)
                toAccount = await account.getAccountByActivity(activity.uuid)
                // return this.message(403, { message: `Akun dengan nomor kegiatan ${activity.no_kegiatan!} tidak ditemukan` })
            }
            let toOneMonthlyAccountCalculation = await monthlyAccountCalculation.getActiveOneMonthlyAccountCalculation(transactionDate.getMonth(), year, disbursement_of_fund_id)
            !toOneMonthlyAccountCalculation ?
                await monthlyAccountCalculation.createMonthlyAccountCalculation(transactionDate.getMonth(), year, disbursement_of_fund_id, amount)
                :
                await monthlyAccountCalculation.updateTotalMonthlyAccountCalculation(amount + toOneMonthlyAccountCalculation.total, toOneMonthlyAccountCalculation.uuid)
            const dataCheck = { account_id: disbursement_of_fund_id, amount: amount }
            const checkMonthlyAccountCalculation = await this.checkAndUpdateMontlyAccountCalculationValue(fromAccount!, fromOneMonthlyAccountCalculation, dataCheck)
            if (!checkMonthlyAccountCalculation) {
                return this.message(403, { message: "Gagal" })
            }
            await this.createJournal(amount, 'D', toAccount?.uuid!, referenceNumber!, transactionDate, year)
            await this.approveWithDrawDisbursementOfFund(disbursement_of_fund_id, ptk_id, recepient)
            return this.message(200, { message: "Succes" })
        } catch (r) {
            console.log(r)
            return this.message(403, { message: "Gagal" })
        }
    }

    public async generateJournalDisbursementOfFund(from_account: string, transaction_date: string, id: string, ptk_id: string | null, recepient: string | null): Promise<messageAttribute<defaultMessage>> {
        try {
            const activeYear = await accountingYear.getActiveAccountingYear()
            const fromAccount = await this.getAccountByUuid(from_account)
            const transactionDate = time.date(transaction_date)
            const fromOneMonthlyAccountCalculation = await monthlyAccountCalculation.getActiveOneMonthlyAccountCalculation(transactionDate.getMonth(), activeYear!.tahun, fromAccount!.uuid)
            if (!fromOneMonthlyAccountCalculation) {
                return this.message(403, { message: "Kalkulasi akun sumber belum dibuka" })
            }
            const checkGroup = await disbursementOfFund.getDisbursementOfFundByGroupId(id)
            const referenceNumber = await journalReferenceNumber.generateReference()
            let finalAmount = 0
            if (checkGroup.length > 0) {
                for (let i in checkGroup) {
                    const createJournal = await this.createJournalDisbursementOfFund(fromAccount!, fromOneMonthlyAccountCalculation!, checkGroup[i]?.rincian_kegiatan!, transactionDate, activeYear!.tahun, checkGroup[i]?.uuid, checkGroup[i]?.amount, referenceNumber!, ptk_id, recepient)
                    if (createJournal.status !== 200) {
                        return this.message(createJournal.status, createJournal.data)
                    }
                    finalAmount += checkGroup[i].amount
                }
            } else {
                const oneDisbursementOfFund = await disbursementOfFund.getDisbursementOfFundByUuid(id)
                const createJournal = await this.createJournalDisbursementOfFund(fromAccount!, fromOneMonthlyAccountCalculation, oneDisbursementOfFund?.rincian_kegiatan!, transactionDate!, activeYear!.tahun, oneDisbursementOfFund.uuid, oneDisbursementOfFund.amount, referenceNumber!, ptk_id, recepient)
                if (createJournal.status !== 200) {
                    return this.message(createJournal.status, createJournal.data)
                }
                finalAmount += oneDisbursementOfFund.amount
            }
            await this.createJournal(finalAmount, 'K', fromAccount!.uuid, referenceNumber!, transactionDate, activeYear!.tahun)
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
                attributes: ['uuid', 'name', 'account_number'],
                include: [{
                    model: MonthlyAccountCalulation,
                    attributes: ['uuid', 'total', 'month_index']
                }]
            },
            attributes: ['group_account', 'group_account_label', 'name']
        })
        return groupAccount
    }

    public async getAccountBeginingBalance(): Promise<messageAttribute<AccountBegeningBalanceAttributes>> {
        const harta = await this.getGroupAccountByNumberGroup(1)
        const kewajiban = await this.getGroupAccountByNumberGroup(2)
        const modal = await this.getGroupAccountByNumberGroup(3)
        const accountBeginingBalance: AccountBegeningBalanceAttributes = {
            harta,
            kewajiban,
            modal
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