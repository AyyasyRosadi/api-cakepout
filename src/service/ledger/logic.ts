import { AccountAttributes } from "../account/dto";
import {Op} from "sequelize"
import { defaultMessage, LogicBase, messageAttribute } from "../logicBase";
import { LedgerAttributes } from "./dto";
import Ledger from "./model";
import Journal from "../journal/model";
import Account from "../account/model";
import accountingYear from "../../helper/accountingYear";
import time from "../../helper/time"


class LedgerLogic extends LogicBase{
    private getMonth():number{
        return new Date().getMonth()
    }

    public async get():Promise<messageAttribute<Array<LedgerAttributes>>>{
        const activeYear = await accountingYear.getActiveAccountingYear()
        const ledger = await Ledger.findAll(
            {
                where:{
                    month_index:this.getMonth(),
                    accounting_year:activeYear?.tahun,
                   
                },
                attributes:["total","month_index"],
                include:[
                    {
                        model:Account,
                        attributes:["name", "account_number", "uuid"]
                    }
                ]
            }
        )
        return this.message(200, ledger)
    }
    public async detail(uuid_account:string, month:number):Promise<messageAttribute<Array<AccountAttributes>| defaultMessage>>{
        //split time require by years
        const timeSplit = time.dateOnly(new Date()).split("-")
        let start = `${timeSplit[0]}-0${month}-01`
        let end = `${timeSplit[0]}-0${month}-31`
        try{
            let account = await Account.findAll({
                where:{
                    uuid:uuid_account
                },
                include:[
                    {
                        model:Journal,
                        where:{
                            transaction_date:{
                                [Op.gte]:start,
                                [Op.lte]: end
                            }
                        },
                        attributes:['reference', 'transaction_date', 'amount', 'status']
                    }
                ],
                order:[[
                    {model:Journal, as:'journals'}, 'transaction_date', 'DESC'
                ]]
                
            })
            
            return this.message(200, account);
        }catch(err){
            return this.message(501, {message:"uups something wrong"});
        }
        
        
    }
}

export default new LedgerLogic;