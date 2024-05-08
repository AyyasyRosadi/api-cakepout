import { LogicBase, messageAttribute } from "../logicBase";
import GroupAccount from "../groupAccount/model";
import Account from "../account/model";
import Journal from "../journal/model";
import GroupAccountAttributes from "../groupAccount/dto";
import { BalanceReportAttributes, GroupBalanceReportAttributes, listOfAccount } from "./dto";
import accountingYear from "../../helper/accountingYear";
import account from "../../helper/account";
import monthlyAccountCalculation from "../../helper/monthlyAccountCalculation";
import { AccountAttributes } from "../account/dto";

import { Op } from "sequelize";
import { JournalAttributes } from "../journal/dto";

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

    private async getJournalByMounth(start: string, end: string): Promise<Array<JournalAttributes>> {
        const journal = await Journal.findAll({
            include: [
                {
                    model: Account,
                }
            ],
            where: {
                transaction_date: {
                    [Op.between]: [start, end]
                }
            },
            order: [['transaction_date', 'asc'], ['reference', 'asc']]
        })
        return journal
    }

    public async cashFlowStatement(): Promise<messageAttribute<Array<JournalAttributes>>> {
        const journal = await this.getJournalByMounth("2024-04-01", "2024-04-30")
        return this.message(200, journal)
    }

    private async restructureBalanceReport(accounts: AccountAttributes[], monthIndex: number, year: string, group_account_name: string): Promise<GroupBalanceReportAttributes> {
        let finalResult: any = []
        let finalAmount = 0

        for (let i in accounts) {
            const oneMonthlyAccount = await monthlyAccountCalculation.getOneMonthlyAccountCalculation(monthIndex, year, accounts[i].uuid)
            if (oneMonthlyAccount && !oneMonthlyAccount?.open) {
                finalResult.push({ uuid: accounts[i].uuid, account_number: accounts[i].account_number, name: accounts[i].name, amount: oneMonthlyAccount?.total, account: true })
                finalAmount += Number(oneMonthlyAccount?.total)
            }
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
            const restructurBalanceReport = await this.restructureBalanceReport(grouping.account, monthIndex, activeYear!.tahun, grouping.name)
            result.push(restructurBalanceReport)
            finalAmount += restructurBalanceReport.finalAmount
        }
        return { finalAmount, group: result }
    }
    public async getBalanceSheetReport(monthIndex: number): Promise<messageAttribute<BalanceReportAttributes>> {
        const harta = await this.getGroupBalanceReport(1, monthIndex)
        const kewajiban = await this.getGroupBalanceReport(2, monthIndex)
        const modal = await this.getGroupBalanceReport(3, monthIndex)
        const pendapatan = await this.getGroupBalanceReport(4, monthIndex)
        const beban = await this.getGroupBalanceReport(5, monthIndex)
        let labaBerjalan = 0
        if (monthIndex !== 6) {
            labaBerjalan = (await this.getGroupBalanceReport(4, monthIndex - 1)).finalAmount - (await this.getGroupBalanceReport(5, monthIndex - 1)).finalAmount
        }
        return this.message(200, { harta: harta, kewajiban: kewajiban, modal: modal, labaRugi: (pendapatan.finalAmount - beban.finalAmount) + labaBerjalan })

    }


}

export default new Logic;