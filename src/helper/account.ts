import { AccountAttributes } from "../service/account/dto"
import Account from "../service/account/model"
import GroupAccountAttributes from "../service/groupAccount/dto"
import GroupAccount from "../service/groupAccount/model"

class AccountHelper {
    private async getLastLabelGroupAccountByGroup(group_account: number): Promise<number> {
        const oneGroupAccount = await GroupAccount.findAll({ where: { group_account }, attributes: { exclude: ['group_accounts'] }, order: [['group_account_label', "DESC"]], limit: 1 })
        if (oneGroupAccount.length === 0) {
            return 1
        }
        return oneGroupAccount[0].group_account_label + 1
    }
    private async getGroupAccount(group_account: number, group_account_label: number): Promise<GroupAccountAttributes | null> {
        const oneGroupAccount = await GroupAccount.findOne({ where: { group_account, group_account_label } })
        return oneGroupAccount
    }
    private async generateGroupAccount(group_account: number, group_account_label: number, name: string): Promise<{ status: boolean, uuid: string | null }> {
        try {
            const addGroupAccount = await GroupAccount.create({ group_account, group_account_label, name })
            return { status: true, uuid: addGroupAccount.uuid }
        } catch (_) {
            return { status: false, uuid: null }
        }
    }
    private async getLastAccountNumber(group_account: number, group_account_label: number): Promise<number> {
        const oneAccount = await Account.findAll({ include: [{ model: GroupAccount, where: { group_account, group_account_label } }], order: [['account_number', 'DESC']], limit: 1 })
        if (oneAccount.length === 0) {
            return 1
        }
        const account_number = oneAccount[0].account_number.split(".")
        return parseInt(account_number[account_number.length - 1]) + 1
    }

    public async generateAccount(name: string, group_account: number, group_account_label: number, activity_id: string | null, group_account_name: string): Promise<boolean> {
        if (group_account_label === 0) {
            const lastGroupAccountLabel = await this.getLastLabelGroupAccountByGroup(group_account)
            const generateGroupAccount = await this.generateGroupAccount(group_account, lastGroupAccountLabel, group_account_name)
            await Account.create({ name, group_account_id: generateGroupAccount.uuid!, activity_id, account_number: `${group_account}.${lastGroupAccountLabel}.1` })
        } else {
            const lastAccountNumber = await this.getLastAccountNumber(group_account, group_account_label)
            const oneGroupAccount = await this.getGroupAccount(group_account, group_account_label)
            await Account.create({ account_number: `${group_account}.${group_account_label}.${lastAccountNumber}`, name, activity_id, group_account_id: oneGroupAccount?.uuid! })
        }
        return true
    }
    public async getAccountByActivity(activity_id: string): Promise<AccountAttributes | null> {
        const oneAccount = await Account.findOne({ where: { activity_id } })
        return oneAccount
    }

}

export default new AccountHelper;