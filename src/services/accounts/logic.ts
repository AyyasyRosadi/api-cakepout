import DetailOfActivity from "../detailOfActivities/model";
import { ActionAttributes } from "../interfaces";
import AccountAttributes from "./dto";
import Account from "./model";


class AccountLogic {
    public async getAllAccount(): Promise<Array<AccountAttributes>> {
        const allAccount = await Account.findAll({ include: { model: DetailOfActivity } })
        return allAccount
    }
    public async getAccountByUuid(uuid: string): Promise<AccountAttributes | null> {
        const oneAccount = await Account.findOne({ where: { uuid }, include: { model: DetailOfActivity } })
        return oneAccount
    }
    public async getAccountByActivity(activity_id: string): Promise<Array<AccountAttributes>> {
        const allAccount = await Account.findAll({ where: { activity_id }, include: { model: DetailOfActivity } })
        return allAccount
    }
    public async getAccountByGroupAccount(group_account: number): Promise<AccountAttributes | null> {
        const oneAccount = await Account.findOne({ where: { group_account }, include: { model: DetailOfActivity } })
        return oneAccount
    }
    public async getAccountByAccountNumber(account_number: string): Promise<AccountAttributes | null> {
        const oneAccount = await Account.findOne({ where: { account_number }, include: { model: DetailOfActivity } })
        return oneAccount
    }
    public async addAccount(name: string, group_account: number, group_account_label: number, account_number: string, activity_id: string): Promise<ActionAttributes> {
        try {
            await Account.create({ name, account_number, activity_id, group_account, group_account_label })
            return { status: true, message: 'add account succes' }
        } catch {
            return { status: false, message: 'bad request' }
        }
    }
    public async updateAccount(uuid: string, name: string, group_account: number, group_account_label: number, account_number: string, activity_id: string): Promise<ActionAttributes> {
        try {
            await Account.update({ name, account_number, activity_id, group_account, group_account_label }, { where: { uuid } })
            return { status: true, message: 'update account succes' }
        } catch {
            return { status: false, message: 'bad request' }
        }
    }
    public async deleteAccount(uuid: string): Promise<ActionAttributes> {
        try {
            await Account.destroy({ where: { uuid } })
            return { status: true, message: 'delete account succes' }
        } catch {
            return { status: false, message: 'bad request' }
        }
    }
}

export default new AccountLogic;