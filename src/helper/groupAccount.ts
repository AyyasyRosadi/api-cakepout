import GroupAccountAttributes from "../services/groupAccounts/dto"
import GroupAccount from "../services/groupAccounts/model"


class GroupAccountHelper {
    public async getGroupAccount(group_account: number, group_account_label: number): Promise<GroupAccountAttributes | null> {
        const oneGroupAccount = await GroupAccount.findOne({ where: { group_account, group_account_label } })
        return oneGroupAccount
    }
    public async generateGroupAccount(group_account: number, group_account_label: number, name: string): Promise<{ status: boolean, uuid: string | null }> {
        try {
            const addGroupAccount = await GroupAccount.create({ group_account, group_account_label, name })
            return { status: true, uuid: addGroupAccount.uuid }
        } catch (_) {
            console.log(_)
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

export default new GroupAccountHelper