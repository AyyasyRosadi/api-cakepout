import AccountAttributes from "../service/accounts/dto";
import { ActionAttributes } from "../service/interfaces";
import Journal from "../service/journals/model";
import account from "./account";
import accountingYear from "./accountingYear";
import message from "./message";
import time from "./time";

type StatusJournal = 'K' | 'D'

class JournalHelper {
    private async createJournal(amount: number, status: StatusJournal, account_id: string, reference: string): Promise<boolean> {
        try {
            const now = time.getPresentTime()
            const activeYear = await accountingYear.getActiveAccountingYear()
            activeYear && await Journal.create({ transaction_date: now, account_id: account_id, accounting_year: activeYear.tahun, amount: amount, reference: reference, status: status })
            return true
        } catch {
            return false
        }
    }
    public async generateJournal(from_account: AccountAttributes, to_account: { amount: number, reference: string, account_id: string }): Promise<ActionAttributes> {
        try {
            const reduceAccount1 = [2, 3, 5]
            const destinationAccount = await account.getAccountByUuid(to_account.account_id)
            if (
                from_account.group_account?.group_account === 1 && reduceAccount1.includes(destinationAccount?.group_account?.group_account!)
                ||
                from_account.group_account?.group_account === 4 && destinationAccount?.group_account?.group_account === 1
            ) {
                await this.createJournal(to_account.amount, 'K', from_account.uuid, to_account.reference)
                await this.createJournal(to_account.amount, 'D', to_account.account_id, to_account.reference)
            } else if (reduceAccount1.includes(from_account.group_account?.group_account!) && destinationAccount?.group_account?.group_account == 1) {
                await this.createJournal(to_account.amount, 'D', from_account.uuid, to_account.reference)
                await this.createJournal(to_account.amount, 'K', to_account.account_id, to_account.reference)
            } else {
                return message.sendMessage(false)
            }
            return message.sendMessage(true)
        } catch {
            return message.sendMessage(false)
        }
    }
}

export default new JournalHelper