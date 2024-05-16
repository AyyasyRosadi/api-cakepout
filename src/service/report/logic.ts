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
import {  Op } from "sequelize";
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

    private async getJournalByMounth(start: string, end: string, asset:boolean, closing:boolean): Promise<Array<JournalAttributes>> {
        const journal = await Journal.findAll({
            include: [
                {
                    model: Account,
                    where:{
                        asset:asset
                    }
                }
            ],
            where: {
                transaction_date: {
                    [Op.between]: [start, end]
                },
                closing:closing
            },
            order: [['transaction_date', 'asc'], ['reference', 'asc']]
        })
        return journal
    }

    private async filterJournal(start: string, end:string):Promise<Array<any>>{
        const journal:Array<JournalAttributes> = await this.getJournalByMounth(start, end, false, true)
        let reference = "";
        let kas  = {name:"", nominal:0, account:"", status:"", references:"", id:""}
        let operationalKas = []
        let collectOperationalKas:any = []
        for(let i=0; i< journal.length;i++){
            let accountSplit = journal[i].account!.account_number.split(".")
            let journal_ = journal[i]
            if(journal_.reference!==reference){
                if(accountSplit[0]==="1"){
                    if(operationalKas.length>=2){
                        collectOperationalKas.push(operationalKas)
                        operationalKas= []
                    }else{
                        operationalKas = []
                    }
                    reference = journal_.reference
                    kas.name = journal_.account!.name
                    kas.nominal = journal_.amount
                    kas.status = journal_.status
                    kas.account=journal_.account!.name
                    kas.references = journal_.reference
                    kas.id = journal_.uuid
                    operationalKas.push(kas)
                }
            }else{
                if(accountSplit[0]==="1"){
                    kas.name = journal_.account!.name
                    kas.nominal = journal_.amount
                    kas.status = journal_.status
                    kas.account = journal_.account!.name
                    kas.references = journal_.reference
                    kas.id = journal_.uuid
                    operationalKas.push(kas)
                }
            }
           kas  = {name:"", nominal:0, account:"", status:"", references:"", id:""}
        }
        return collectOperationalKas
    }

    private async groupNameCashFlow(name:string, data:Array<any>){
        
        let account = {name, accounts:[], total:0}
        let totalMonthlyAccountCalculation = 0
        let accounts:any = []
        for(const d in data){
            let justAccount = data[d].account
            for(const e in justAccount){
                let account_ = {account_number:"", account_name:"", total:0}
                account_.account_name=justAccount[e].name
                account_.account_number=justAccount[e].account_number
                if(justAccount[e].monthly_account_calculations.length!=0){
                    account_.total = justAccount[e].monthly_account_calculations[0].total
                    totalMonthlyAccountCalculation += justAccount[e].monthly_account_calculations[0].total
                }
                accounts.push(account_)
            }
            
            
        }
        account.accounts= accounts
        account.total = totalMonthlyAccountCalculation
        return account
        
    }

    public async cashFlowStatement(): Promise<messageAttribute<any>> {
        const saldoAwal = await monthlyAccountCalculation.getMonthlyAccountCalculationsByGroupAndIndexMonth(1,4, false, false)
        const saldoAwalProcess = await this.groupNameCashFlow("Saldo Awal", saldoAwal)
        const operasionalPendapatan = await monthlyAccountCalculation.getMonthlyAccountCalculationsByGroupAndIndexMonth(4,5, false, false)
        const operasionalPendapatanProcess = await this.groupNameCashFlow("Operasional Pendapatan", operasionalPendapatan)
        const operasionalPengeluaran = await monthlyAccountCalculation.getMonthlyAccountCalculationsByGroupAndIndexMonth(5,5, false, false)
        const operasionalPengeluaranProcess = await this.groupNameCashFlow("Operasional Pengeluaran", operasionalPengeluaran)
        const pendanaan = await monthlyAccountCalculation.getMonthlyAccountCalculationsByGroupAndIndexMonth(3,5, false, false)
        const pendanaanProcess = await this.groupNameCashFlow("Pendanaan", pendanaan)
        const ok = [saldoAwalProcess, [{name:"Operasional", pendapatan:operasionalPendapatanProcess, pengeluaran:operasionalPengeluaranProcess}], pendanaanProcess]
        const filter = await this.filterJournal('2024-05-01', '2024-05-31')

        return this.message(200, filter)
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
    private async getLabaBerjalan(monthIndex: number): Promise<number> {
        let finalLabaBerjalan = 0
        if (monthIndex < 6) {
            for (let i = 6; i < 12; i++) {
                finalLabaBerjalan += (await this.getGroupBalanceReport(4, i)).finalAmount - (await this.getGroupBalanceReport(5, i)).finalAmount
            }
            for (let i = 0; i <= monthIndex; i++) {
                finalLabaBerjalan += (await this.getGroupBalanceReport(4, i)).finalAmount - (await this.getGroupBalanceReport(5, i)).finalAmount
            }
        } else {
            for (let i = 6; i <= monthIndex; i++) {
                finalLabaBerjalan += (await this.getGroupBalanceReport(4, i)).finalAmount - (await this.getGroupBalanceReport(5, i)).finalAmount
            }
        }
        return finalLabaBerjalan
    }

    public async getBalanceSheetReport(monthIndex: number): Promise<messageAttribute<BalanceReportAttributes>> {
        const harta = await this.getGroupBalanceReport(1, monthIndex)
        const kewajiban = await this.getGroupBalanceReport(2, monthIndex)
        const modal = await this.getGroupBalanceReport(3, monthIndex)
        const labaRugi = await this.getLabaBerjalan(monthIndex)
        return this.message(200, { harta: harta, kewajiban: kewajiban, modal: modal, labaRugi: labaRugi })

    }


}

export default new Logic;