import AccountAttributes from "../service/account/dto";
import Account from "../service/account/model";
import GroupAccount from "../service/groupAccount/model";


class AccountHelper {
    public async getLastAccountNumber(group_account: number, group_account_label: number): Promise<number> {
        const oneAccount = await Account.findAll({ include: [{ model: GroupAccount, where: { group_account, group_account_label } }], order: [['account_number', 'DESC']], limit: 1 })
        if (oneAccount.length === 0) {
            return 1
        }
        return oneAccount[0].account_number + 1
    }
    public async getAccountByUuid(uuid: string): Promise<AccountAttributes | null> {
        try {
            const oneAccount = await Account.findOne({ where: { uuid }, include: [{ model: GroupAccount }] })
            return oneAccount
        } catch (r) {
            return null
        }
    }
    public async getAccountByActivityId(activity_id: string): Promise<AccountAttributes | null> {
        const oneAccount = await Account.findOne({ where: { activity_id } })
        return oneAccount
    }
}

export default new AccountHelper;