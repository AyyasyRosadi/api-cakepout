import { Op } from "sequelize";
import Account from "../accounts/model";
import JournalAttributes from "./dto";
import Journal from "./model";

class JournalLogic {
    public async getAllJournal(): Promise<Array<JournalAttributes>> {
        const allJournal = await Journal.findAll()
        return allJournal
    }
    public async getJournalByUuid(uuid: string): Promise<JournalAttributes | null> {
        const oneJournal = await Journal.findOne({ where: { uuid }, include: { model: Account } })
        return oneJournal
    }
    public async getJournalByStatus(status: number): Promise<Array<JournalAttributes>> {
        const allJournal = await Journal.findAll({ where: { status }, include: { model: Account } })
        return allJournal
    }
    public async getJournalByTransactionDate(start: string, end: string): Promise<Array<JournalAttributes>> {
        const allJournal = await Journal.findAll({ where: { transaction_date: { [Op.gte]: start, [Op.lte]: end } }, include: { model: Account } })
        return allJournal
    }
    public async getJournalByYear(accounting_year: string): Promise<Array<JournalAttributes>> {
        const allJournal = await Journal.findAll({ where: { accounting_year }, include: { model: Account } })
        return allJournal
    }
    public async getJournalByAccountId(account_id: string): Promise<Array<JournalAttributes>> {
        const allJournal = await Journal.findAll({ where: { account_id }, include: { model: Account } })
        return allJournal
    }
}

export default JournalLogic;