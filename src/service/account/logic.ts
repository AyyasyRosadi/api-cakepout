import { Op } from "sequelize";
import account from "../../helper/account";
import groupAccount from "../../helper/groupAccount";
import message from "../../helper/message";
import DetailOfActivity from "../detailOfActivity/model";
import GroupAccount from "../groupAccount/model";
import { ActionAttributes } from "../interfaces";
import AccountAttributes from "./dto";
import Account from "./model";
import {LogicBase, messageAttribute} from '../logicBase';

interface AccountPaginationAttributes {
    page: number;
    totalPages: number;
    totalItems: number;
    data: Array<AccountAttributes>;
}


class AccountLogic extends LogicBase{
    private include = [
        { model: DetailOfActivity, as: 'detail_of_activity' },
        { model: GroupAccount }     
    ]
    public async getAllAccount():Promise<messageAttribute<Array<AccountAttributes>>>{
        const allAccount = await Account.findAll({include:this.include})
        return this.message<Array<AccountAttributes>>(200, allAccount)
    }
    public async getAllAccountByPage(page: number, size: number): Promise<AccountPaginationAttributes> {
        const offset = (page - 1) * size
        const allAccount = await Account.findAndCountAll({
            limit: size,
            offset: offset,
            include: this.include,
        })
        return {
            page,
            totalPages: Math.ceil(allAccount.count / size),
            totalItems: allAccount.count,
            data: allAccount.rows
        }
    }
    public async getAccountByUuid(uuid: string): Promise<messageAttribute<AccountAttributes|any>> {
        const oneAccount = await Account.findOne({ where: { uuid }, include: this.include })
        if(!oneAccount){
            return this.message(404, {message:"not found"})
        }
        return this.message(200, oneAccount)
    }
    public async getAccountByActivity(activity_id: string): Promise<Array<AccountAttributes>> {
        const allAccount = await Account.findAll({ where: { activity_id }, include: this.include })
        return allAccount
    }
    public async getAccountByGroupAccount(group_account: number): Promise<Array<AccountAttributes>> {
        const queryGroupAccount = group_account === 4 ? { [Op.not]: { group_account } } : { group_account }
        const oneAccount = await Account.findAll({
            include: [
                { model: DetailOfActivity, as: 'detail_of_activity' },
                { model: GroupAccount, where: queryGroupAccount }
            ]
        })
        return oneAccount
    }
    public async getAccountByAccountNumber(account_number: string): Promise<AccountAttributes | null> {
        const oneAccount = await Account.findOne({ where: { account_number }, include: this.include })
        return oneAccount
    }
    public async addAccount(name: string, group_account: number, group_account_label: number, activity_id: string | null, group_account_name: string): Promise<ActionAttributes> {
        try {
            if (group_account_label === 0) {
                const lastGroupAccountLabel = await groupAccount.getLastLabelGroupAccountByGroup(group_account)
                const generateGroupAccount = await groupAccount.generateGroupAccount(group_account, lastGroupAccountLabel, group_account_name)
                generateGroupAccount && generateGroupAccount.uuid && await Account.create({ name, group_account_id: generateGroupAccount.uuid, activity_id, account_number: '1' })
            } else {
                const lastAccountNumber = await account.getLastAccountNumber(group_account, group_account_label)
                const oneGroupAccount = await groupAccount.getGroupAccount(group_account, group_account_label)
                lastAccountNumber && oneGroupAccount && await Account.create({ account_number: `${lastAccountNumber}`, name, activity_id, group_account_id: oneGroupAccount.uuid })
            }
            return message.sendMessage(true)
        } catch (_) {
            return message.sendMessage(false)
        }
    }
    public async updateAccount(uuid: string, name: string): Promise<ActionAttributes> {
        try {
            await Account.update({ name }, { where: { uuid } })
            return message.sendMessage(true)
        } catch {
            return message.sendMessage(false)
        }
    }
    public async deleteAccount(uuid: string): Promise<ActionAttributes> {
        try {
            await Account.destroy({ where: { uuid } })
            return message.sendMessage(true)
        } catch {
            return message.sendMessage(false)
        }
    }
}

export default new AccountLogic;