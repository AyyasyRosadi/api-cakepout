import { Op } from "sequelize";
import Account from "../account/model";
import JournalAttributes from "./dto";
import Journal from "./model";
import { ActionAttributes } from "../interfaces";
import message from "../../helper/message";
import account from "../../helper/account";
import GroupAccount from "../groupAccount/model";
import time from "../../helper/time";
import accountingYear from "../../helper/accountingYear";
import journalReferenceNumber from "../../helper/journalReferenceNumber";

interface JournalPaginationAttributes {
    page: number;
    totalPages: number;
    totalItems: number;
    data: Array<JournalAttributes>;
}

class JournalLogic {
    public async getAllJournal(page: number, size: number): Promise<JournalPaginationAttributes> {
        const offset = (page - 1) * size
        const allJournal = await Journal.findAndCountAll(
            {
                limit: size,
                offset: offset,
                include: [{ model: Account, include: [{ model: GroupAccount }] }],
                order: [["transaction_date", "DESC"], ['amount', 'DESC']]
            }
        )
        return {
            page,
            totalPages: Math.ceil(allJournal.count / size),
            totalItems: allJournal.count,
            data: allJournal.rows
        }
    }
    public async getJournalByUuid(uuid: string): Promise<JournalAttributes | null> {
        const oneJournal = await Journal.findOne({ where: { uuid }, include: { model: Account } })
        return oneJournal
    }
    public async getJournalByStatus(status: string): Promise<Array<JournalAttributes>> {
        const allJournal = await Journal.findAll({ where: { status }, include: { model: Account } })
        return allJournal
    }
    public async getJournalByTransactionDate(start: string, end: string): Promise<Array<JournalAttributes>> {
        const allJournal = await Journal.findAll({ where: { transaction_date: { [Op.gte]: start, [Op.lte]: end } }, include: { model: Account } })
        return allJournal
    }
    public async getJournalByYear(year: string): Promise<Array<JournalAttributes>> {
        const allJournal = await Journal.findAll({ where: { accounting_year: year }, include: { model: Account } })
        return allJournal
    }
    public async getJournalByAccountId(accountId: string): Promise<Array<JournalAttributes>> {
        const allJournal = await Journal.findAll({ where: { account_id: accountId }, include: { model: Account } })
        return allJournal
    }
    private async createJournal(amount: number, status: "K" | "D", account_id: string, reference: string): Promise<boolean> {
        try {
            const now = time.getPresentTime()
            const activeYear = await accountingYear.getActiveAccountingYear()
            await Journal.create({ transaction_date: now, account_id: account_id, accounting_year: activeYear!.tahun, amount: amount, reference: reference, status: status })
            return true
        } catch {
            return false
        }
    }
    public async generateJournal(from_account: string, to_account: Array<{ account_id: string, amount: number, reference: string }>): Promise<ActionAttributes> {
        try {
            const oneAccount = await account.getAccountByUuid(from_account)
            if (!oneAccount) {
                return message.sendMessage(false)
            }
            for (let i in to_account) {
                const referenceNumber = await journalReferenceNumber.generateReference()
                console.log(referenceNumber)
                if (oneAccount.group_account?.group_account === 1 || oneAccount.group_account?.group_account === 4) {
                    await this.createJournal(to_account[i].amount, 'K', oneAccount.uuid, referenceNumber!)
                    await this.createJournal(to_account[i].amount, 'D', to_account[i].account_id, referenceNumber!)
                } else {
                    await this.createJournal(to_account[i].amount, 'D', oneAccount.uuid, referenceNumber!)
                    await this.createJournal(to_account[i].amount, 'K', to_account[i].account_id, referenceNumber!)
                }
            }
            return message.sendMessage(true)
        } catch (r) {
            console.log(r)
            return message.sendMessage(false)
        }
    }
}

export default new JournalLogic;