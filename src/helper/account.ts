import Account from "../service/accounts/model";
import GroupAccount from "../service/groupAccounts/model";


class AccountHelper {
    public async getLastAccountNumber(group_account: number, group_account_label: number): Promise<number> {
        const oneAccount = await Account.findAll({ include: [{ model: GroupAccount, where: { group_account, group_account_label } }], order: [['account_number', 'DESC']], limit: 1 })
        if (oneAccount.length === 0) {
            return 1
        }
        return parseInt(oneAccount[0].account_number) + 1
    }
}

export default new AccountHelper;