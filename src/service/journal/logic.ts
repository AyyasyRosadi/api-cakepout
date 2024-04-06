import { Op } from "sequelize";
import Account from "../account/model";
import JournalAttributes from "./dto";
import Journal from "./model";
import { ActionAttributes } from "../interfaces";
import message from "../../helper/message";
import account from "../../helper/account";
import GroupAccount from "../groupAccount/model";
import journal from "../../helper/journal";

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
    public async addJournal(from_account: string, to_account: Array<{ account_id: string, amount: number, reference: string }>): Promise<ActionAttributes> {
        try {
            const oneAccount = await account.getAccountByUuid(from_account)
            if (!oneAccount) {
                return message.sendMessage(false)
            }
            for (let i in to_account) {
                await journal.generateJournal(oneAccount, to_account[i])
            }
            return message.sendMessage(true)
        } catch (r) {
            console.log(r)
            return message.sendMessage(false)
        }
    }
}

export default new JournalLogic;