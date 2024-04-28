import { AccountAttributes } from "../service/account/dto";
import Account from "../service/account/model";
import GroupAccountAttributes from "../service/groupAccount/dto";
import GroupAccount from "../service/groupAccount/model";


class AccountHelper {
    public async getLastAccountNumber(group_account: number, group_account_label: number): Promise<number> {
        const oneAccount = await Account.findAll({ include: [{ model: GroupAccount, where: { group_account, group_account_label } }], order: [['account_number', 'DESC']], limit: 1 })
        if (oneAccount.length === 0) {
            return 1
        }
        const account_number = oneAccount[0].account_number.split(".")
        return parseInt(account_number[account_number.length - 1]) + 1
    }
    public async getAccountByUuid(uuid: string): Promise<AccountAttributes | null> {
        try {
            const oneAccount = await Account.findOne({ where: { uuid }, include: [{ model: GroupAccount }] })
            return oneAccount
        } catch {
            return null
        }
    }
    public async getAccountByActivityId(activity_id: string): Promise<AccountAttributes | null> {
        const oneAccount = await Account.findOne({ where: { activity_id } })
        return oneAccount
    }
    public async getGroupAccount(group_account: number, group_account_label: number): Promise<GroupAccountAttributes | null> {
        const oneGroupAccount = await GroupAccount.findOne({ where: { group_account, group_account_label } })
        return oneGroupAccount
    }
    public async generateGroupAccount(group_account: number, group_account_label: number, name: string): Promise<{ status: boolean, uuid: string | null }> {
        try {
            const addGroupAccount = await GroupAccount.create({ group_account, group_account_label, name })
            return { status: true, uuid: addGroupAccount.uuid }
        } catch (_) {
            return { status: false, uuid: null }
        }
    }
    public async getLastLabelGroupAccountByGroup(group_account: number): Promise<number> {
        const oneGroupAccount = await GroupAccount.findAll({ where: { group_account }, attributes: { exclude: ['group_accounts`'] }, order: [['group_account_label', "DESC"]], limit: 1 })
        if (oneGroupAccount.length === 0) {
            return 1
        }
        return oneGroupAccount[0].group_account_label + 1
    }
}

export default new AccountHelper;