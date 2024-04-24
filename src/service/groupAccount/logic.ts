import { LogicBase, messageAttribute } from "../logicBase";
import GroupAccountAttributes from "./dto";
import GroupAccount from "./model";


class GroupAccountLogic extends LogicBase {
    public async getAllGroupAccount(): Promise<messageAttribute<Array<GroupAccountAttributes>>> {
        const allGroupAccount = await GroupAccount.findAll()
        return this.message(200,allGroupAccount)
    }
    public async getGroupAccountByGroup(group_account: number): Promise<messageAttribute<Array<GroupAccountAttributes>>> {
        const allGroupAccount = await GroupAccount.findAll({ where: { group_account: group_account }, order: [['group_account', 'DESC'], ['group_account_label', "DESC"]] })
        return this.message(200,allGroupAccount)
    }
    public async getGroupAccountByLabel(group_account: number, group_account_label: number): Promise<messageAttribute<Array<GroupAccountAttributes>>> {
        const allGroupAccount = await GroupAccount.findAll({ where: { group_account, group_account_label }, order: [['group_account', 'DESC'], ['group_account_label', "DESC"]] })
        return this.message(200,allGroupAccount)
    }
}

export default new GroupAccountLogic;