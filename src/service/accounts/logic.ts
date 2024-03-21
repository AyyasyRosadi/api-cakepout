import account from "../../helper/account";
import groupAccount from "../../helper/groupAccount";
import message from "../../helper/message";
import DetailOfActivity from "../detailOfActivities/model";
import GroupAccount from "../groupAccounts/model";
import { ActionAttributes } from "../interfaces";
import AccountAttributes from "./dto";
import Account from "./model";

const include = [
    { model: DetailOfActivity, as: 'detail_of_activity' },
    { model: GroupAccount }
]

class AccountLogic {
    public async getAllAccount(): Promise<Array<AccountAttributes>> {
        const allAccount = await Account.findAll({
            include: include,
        })
        return allAccount
    }
    public async getAccountByUuid(uuid: string): Promise<AccountAttributes | null> {
        const oneAccount = await Account.findOne({ where: { uuid }, include: include })
        return oneAccount
    }
    public async getAccountByActivity(activity_id: string): Promise<Array<AccountAttributes>> {
        const allAccount = await Account.findAll({ where: { activity_id }, include: include })
        return allAccount
    }
    public async getAccountByGroupAccount(group_account_id: string): Promise<AccountAttributes | null> {
        const oneAccount = await Account.findOne({ where: { group_account_id }, include: include })
        return oneAccount
    }
    public async getAccountByAccountNumber(account_number: string): Promise<AccountAttributes | null> {
        const oneAccount = await Account.findOne({ where: { account_number }, include: include })
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