import GroupAccountAttributes from "./dto";
import GroupAccount from "./model";


class GroupAccountLogic {
    public async getAllGroupAccount(): Promise<Array<GroupAccountAttributes>> {
        const allGroupAccount = await GroupAccount.findAll()
        return allGroupAccount
    }
    public async getGroupAccountByGroup(group_account: number): Promise<Array<GroupAccountAttributes>> {
        const allGroupAccount = await GroupAccount.findAll({ where: { group_account: group_account }, order: [['group_account', 'DESC'], ['group_account_label', "DESC"]] })
        return allGroupAccount
    }
    public async getGroupAccountByLabel(group_account: number, group_account_label: number): Promise<Array<GroupAccountAttributes>> {
        const allGroupAccount = await GroupAccount.findAll({ where: { group_account, group_account_label }, order: [['group_account', 'DESC'], ['group_account_label', "DESC"]] })
        return allGroupAccount
    }
}

export default new GroupAccountLogic;