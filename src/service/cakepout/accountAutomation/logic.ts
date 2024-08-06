import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import Account from "../account/model";
import GroupAccountAttributes from "../groupAccount/dto";
import GroupAccount from "../groupAccount/model";

import AccountAutomation from "./model";

class AccountAutomationLogic extends LogicBase{
    public async create(uuidAccountFrom:string, uuidAccountTo:string, role:string):Promise<messageAttribute<defaultMessage>>{
        await AccountAutomation.create({
            uuid_account_from: uuidAccountFrom,
            uuid_account_to:uuidAccountTo,
            role:role
        })
        return this.message(200, {message:"saved"})
    }

    public async getAccount(groupAccount:number):Promise<messageAttribute<GroupAccountAttributes|null|defaultMessage>>{
        if(groupAccount!==0 && groupAccount<=5){
            const account = await GroupAccount.findOne({
                where:{
                    group_account:groupAccount
                },
                include:[
                    {
                        model:Account,
                        as:"account"
                    }
                ]
            })
            return this.message(200, account)
        }
        return this.message(404, {message:"uups"})
        
    }
    
}

export default new AccountAutomationLogic