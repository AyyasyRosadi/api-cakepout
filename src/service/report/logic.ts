import { LogicBase, messageAttribute } from "../logicBase";
import GroupAccount from "../groupAccount/model";
import Account from "../account/model";
import Journal from "../journal/model";
import GroupAccountAttributes from "../groupAccount/dto";
import { BalanceReportAttributes, GroupBalanceReportAttributes, listOfAccount } from "./dto";
import accountingYear from "../../helper/accountingYear";
import account from "../../helper/account";
import { AccountAttributes } from "../account/dto";
import { Op } from "sequelize";
import { JournalAttributes } from "../journal/dto";
import Ledger from "../ledger/model";
import ledger from "../../helper/ledger";

class Logic extends LogicBase {
    private async getJournalByDate(groupAccount: number, start: string, end: string): Promise<Array<GroupAccountAttributes>> {
        const journal = await GroupAccount.findAll({
            where: {
                group_account: groupAccount
            },
            include: [{
                model: Account,
                as: "account",
                include: [
                    {
                        model: Journal,
                        where: {
                            transaction_date: {
                                [Op.between]: [start, end]
                            }
                        }
                    }
                ]
            }]
        })
        return journal
    }
    public async incomeStatement(start: any, end: any): Promise<messageAttribute<listOfAccount>> {
        let listAccountNumber = [4, 5]
        let income: any = []
        let totalIncome = 0
        let cost: any = []
        let totalCost = 0
        for (let i in listAccountNumber) {
            let journals = await this.getJournalByDate(listAccountNumber[i], start, end)
            for (let g in journals) {
                let accounts: any = journals[g].account
                for (let a in accounts) {
                    let journalInAccount = accounts[a].journals
                    let total = 0
                    if (journalInAccount.length !== 0) {
                        for (let t in journalInAccount) {
                            total = total + journalInAccount[t].amount
                        }
                    }
                    let account = { account_number: accounts[a].account_number, name: accounts[a].name, total: total }
                    if (journals[g].group_account === 4) {
                        totalIncome = totalIncome + total
                        income.push(account)
                    } else if (journals[g].group_account === 5) {
                        totalCost = totalCost + total
                        cost.push(account)
                    }
                }

            }
        }
        const result: listOfAccount = { income, cost, totalCost, totalIncome, incomeStatement: totalIncome - totalCost }
        return this.message(200, result)
    }

    private async getJournal(groupAccount: number): Promise<any> {
        const journal = await GroupAccount.findAll({
            where: {
                group_account: groupAccount
            },
            include: [{
                model: Account,
                as: "account",
                include: [
                    {
                        model: Journal,

                    }
                ]
            }]
        })
        return journal
    }

    private async getJournalByMounth(start: string, end: string, asset: boolean, closing: boolean): Promise<Array<JournalAttributes>> {
        const journal = await Journal.findAll({
            include: [
                {
                    model: Account,
                    where: {
                        asset: asset
                    }
                }
            ],
            where: {
                transaction_date: {
                    [Op.between]: [start, end]
                },
                closing: closing
            },
            order: [['transaction_date', 'asc'], ['reference', 'asc']]
        })
        return journal
    }

    private async filterJournal(start: string, end: string): Promise<Array<any>> {
        const journal: Array<JournalAttributes> = await this.getJournalByMounth(start, end, true, true)
        let reference = "";
        let kas = { name: "", nominal: 0, account: "", status: "", references: "", id: "" }
        let operationalKas = []
        let collectOperationalKas: any = []
        for (let i = 0; i < journal.length; i++) {
            let accountSplit = journal[i].account!.account_number.split(".")
            let journal_ = journal[i]
            if (journal_.reference !== reference) {
                if (accountSplit[0] === "1") {
                    if (operationalKas.length >= 2) {
                        collectOperationalKas.push(operationalKas)
                        operationalKas = []
                    } else {
                        operationalKas = []
                    }
                    reference = journal_.reference
                    kas.name = journal_.account!.name
                    kas.nominal = journal_.amount
                    kas.status = journal_.status
                    kas.account = journal_.account!.name
                    kas.references = journal_.reference
                    kas.id = journal_.uuid
                    operationalKas.push(kas)
                }
            } else {
                if (accountSplit[0] === "1") {
                    kas.name = journal_.account!.name
                    kas.nominal = journal_.amount
                    kas.status = journal_.status
                    kas.account = journal_.account!.name
                    kas.references = journal_.reference
                    kas.id = journal_.uuid
                    operationalKas.push(kas)
                }
            }
            kas = { name: "", nominal: 0, account: "", status: "", references: "", id: "" }
        }
        return collectOperationalKas
    }

    private async groupNameCashFlow(name: string, data: Array<any>) {

        let account = { name, accounts: [], total: 0 }
        let totalLedger = 0
        let accounts: any = []
        for (const d in data) {
            let justAccount = data[d].account
            for (const e in justAccount) {
                let account_ = { account_number: "", account_name: "", total: 0 }
                account_.account_name = justAccount[e].name
                account_.account_number = justAccount[e].account_number
                if (justAccount[e].monthly_account_calculations.length != 0) {
                    account_.total = justAccount[e].monthly_account_calculations[0].total
                    totalLedger += justAccount[e].monthly_account_calculations[0].total
                }
                accounts.push(account_)
            }


        }
        account.accounts = accounts
        account.total = totalLedger
        return account

    }
    private async getLedgerByGroupAndMonthIndex(group_account: number, month_index: number, asset: boolean, open: boolean): Promise<GroupAccountAttributes[]> {
        const allLedger = await GroupAccount.findAll({
            where: {
                group_account
            },
            order: [
                [{ model: Account, as: 'account' }, 'account_number', 'asc']
            ],
            include: [
                {
                    model: Account,
                    as: 'account',
                    where: {
                        asset
                    },
                    include: [
                        {
                            model: Ledger,
                            where: {
                                month_index,
                                open
                            }
                        }
                    ]
                }
            ]
        })
        return allLedger
    }
    public async cashFlowStatement(): Promise<messageAttribute<any>> {
        const saldoAwal = await this.getLedgerByGroupAndMonthIndex(1, 4, false, false)
        const saldoAwalProcess = await this.groupNameCashFlow("Saldo Awal", saldoAwal)
        const operasionalPendapatan = await this.getLedgerByGroupAndMonthIndex(4, 5, false, false)
        const operasionalPendapatanProcess = await this.groupNameCashFlow("Operasional Pendapatan", operasionalPendapatan)
        const operasionalPengeluaran = await this.getLedgerByGroupAndMonthIndex(5, 5, false, false)
        const operasionalPengeluaranProcess = await this.groupNameCashFlow("Operasional Pengeluaran", operasionalPengeluaran)
        const pendanaan = await this.getLedgerByGroupAndMonthIndex(3, 5, false, false)
        const pendanaanProcess = await this.groupNameCashFlow("Pendanaan", pendanaan)
        const ok = [saldoAwalProcess, [{ name: "Operasional", pendapatan: operasionalPendapatanProcess, pengeluaran: operasionalPengeluaranProcess }], pendanaanProcess]
        const filter = await this.filterJournal('2024-05-01', '2024-05-31')
        return this.message(200, filter)
    }

    private async getAccountByGroup(accounts: AccountAttributes[], monthIndex: number, year: string, group_account_name: string): Promise<GroupBalanceReportAttributes> {
        let finalResult: (Omit<AccountAttributes, "activity_id" | "group_account_id"> & { amount: number; })[] = []
        let finalAmount = 0

        for (let i in accounts) {
            let totalAccountAmount = 0
            if (monthIndex < 6) {
                for (let j = 6; j < 12; j++) {
                    const oneLedger = await ledger.getOneLedgerByOpenClosed(year, j, accounts[i]?.uuid!)
                    finalAmount += oneLedger?.total || 0
                    totalAccountAmount += oneLedger?.total || 0
                }
                for (let j = 0; j <= monthIndex; j++) {
                    const oneLedger = await ledger.getOneLedgerByOpenClosed(year, j, accounts[i]?.uuid!)
                    finalAmount += oneLedger?.total || 0
                    totalAccountAmount += oneLedger?.total || 0
                }
            } else {
                for (let j = 6; j <= monthIndex; j++) {
                    const oneLedger = await ledger.getOneLedgerByOpenClosed(year, j, accounts[i]?.uuid!)
                    finalAmount += oneLedger?.total || 0
                    totalAccountAmount += oneLedger?.total || 0
                }
            }
            finalResult.push({ uuid: accounts[i].uuid, account_number: accounts[i].account_number, name: accounts[i].name, amount: totalAccountAmount, asset: accounts[i]?.asset })
        }
        return { group_account_name, finalAmount, accounts: finalResult }
    }

    private async getGroupBalanceReport(index: number, monthIndex: number): Promise<{ finalAmount: number, group: GroupBalanceReportAttributes[] }> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const result = []
        let finalAmount = 0
        const group = await account.getGroupAccountByNumberGroup(index)
        for (let j in group) {
            const grouping = group[j] as GroupAccountAttributes & { account: AccountAttributes[] }
            const restructurBalanceReport = await this.getAccountByGroup(grouping.account, monthIndex, activeYear!.tahun, grouping.name)
            result.push(restructurBalanceReport)
            finalAmount += restructurBalanceReport.finalAmount
        }
        return { finalAmount, group: result }
    }

    public async getBalanceSheetReport(monthIndex: number): Promise<messageAttribute<BalanceReportAttributes>> {
        const harta = await this.getGroupBalanceReport(1, monthIndex)
        const kewajiban = await this.getGroupBalanceReport(2, monthIndex)
        const modal = await this.getGroupBalanceReport(3, monthIndex)
        const labaRugi = (await this.getGroupBalanceReport(4, monthIndex)).finalAmount - (await this.getGroupBalanceReport(5, monthIndex)).finalAmount
        return this.message(200, { harta: harta, kewajiban: kewajiban, modal: modal, labaRugi: labaRugi })
    }


}

export default new Logic;