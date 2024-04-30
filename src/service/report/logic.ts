import { LogicBase, messageAttribute } from "../logicBase";
import GroupAccount from "../groupAccount/model";
import Account from "../account/model";
import Journal from "../journal/model";
import { Result } from "express-validator";
import GroupAccountAttributes from "../groupAccount/dto";
import { listOfAccount } from "./dto";

class Logic extends LogicBase{
    private async getJournalByDate(groupAccount: number, start: string, end:string):Promise<Array<GroupAccountAttributes>>{
        const journal = await GroupAccount.findAll({
            where:{
                group_account:groupAccount
            },
            include:[{
                model:Account,
                as:"account",
                include:[
                    {
                        model:Journal,
                        where: {
                            transaction_date:{
                                $between:[start, end]
                            }
                        }
                    }
                ]
            }]
        })
        return journal
    }
    public async incomeStatement(start: any, end:any):Promise<messageAttribute<listOfAccount>>{
        let listAccountNumber = [4, 5]
        let income:any = []
        let totalIncome = 0
        let cost:any = []
        let totalCost = 0
        for(let i in listAccountNumber){
            let journals = await this.getJournalByDate(listAccountNumber[i], start, end)
            for(let g in journals){
                let accounts:any = journals[g].account
                for(let a in accounts){
                    let journalInAccount = accounts[a].journals 
                    let total = 0
                    if(journalInAccount.length!==0){
                        for(let t in journalInAccount){
                            total = total + journalInAccount[t].amount                            
                        }
                    }
                    let account = {account_number:accounts[a].account_number, name:accounts[a].name, total:total}
                    if(journals[g].group_account===4){
                        totalIncome = totalIncome + total
                        income.push(account)
                    }else if(journals[g].group_account===5){
                        totalCost = totalCost + total
                        cost.push(account)
                    }
                }
               
            }
        }
        const result:listOfAccount = {income, cost, totalCost, totalIncome, incomeStatement:totalIncome-totalCost}
        return this.message(200, result)
    }

    private async getJournal(groupAccount:number):Promise<any>{
        const journal = await GroupAccount.findAll({
            where:{
                group_account:groupAccount
            },
            include:[{
                model:Account,
                as:"account",
                include:[
                    {
                        model:Journal,
                        
                    }
                ]
            }]
        })
        return journal
    }

    public async cashFlowStatement():Promise<any>{
        const journal = await this.getJournal(1)
        return this.message(200, journal)
    }
}

export default new Logic;