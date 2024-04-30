import { LogicBase, messageAttribute } from "../logicBase";
import GroupAccount from "../groupAccount/model";
import Account from "../account/model";
import Journal from "../journal/model";
import GroupAccountAttributes from "../groupAccount/dto";
import { BalanceReportAttributes, listOfAccount } from "./dto";
import accountingYear from "../../helper/accountingYear";
import account from "../../helper/account";
import monthlyAccountCalculation from "../../helper/monthlyAccountCalculation";
import { AccountAttributes } from "../account/dto";

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
                                $between: [start, end]
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

    public async cashFlowStatement(): Promise<any> {
        const journal = await this.getJournal(1)
        return this.message(200, journal)
    }

    private async restructureReport(accounts: AccountAttributes[], monthIndex: number, year: string): Promise<BalanceReportAttributes> {
        let finalResult = []
        let finalAmount = 0
        for (let i in accounts) {
            const oneMonthlyAccount = await monthlyAccountCalculation.getOneMonthlyAccountCalculation(monthIndex, year, accounts[i].uuid)
            if(oneMonthlyAccount && !oneMonthlyAccount?.open){
                finalResult.push({ uuid: accounts[i].uuid, account_number: accounts[i].account_number, name: accounts[i].name, amount: oneMonthlyAccount?.total })
                finalAmount += Number(oneMonthlyAccount?.total)
            }
        }
        return { finalAmount, accounts: finalResult }
    }
    public async getBalanceSheetReport(monthIndex: number): Promise<messageAttribute<BalanceReportAttributes[]>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const result = []
        for (let i = 1; i <= 3; i++) {
            const group = await account.getGroupAccountByNumberGroup(i)
            for (let j in group) {
                const grouping = group[j] as GroupAccountAttributes & { account: AccountAttributes[] }
                const restructureReport = await this.restructureReport(grouping.account, monthIndex, activeYear!.tahun)
                result.push(restructureReport)
            }
        }
        return this.message(200, result)

    }
}

export default new Logic;