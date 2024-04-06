import message from "../../helper/message";
import { ActionAttributes } from "../interfaces";
import JournalReferenceNumberAttributes from "./dto";
import JournalReferenceNumber from "./model";

class JournalReferenceNumberLogic {
    public async getAllJournalReferenceNumber(): Promise<Array<JournalReferenceNumberAttributes>> {
        const allJournalReferenceNumber = await JournalReferenceNumber.findAll()
        return allJournalReferenceNumber
    }
    public async getJournalReferenceNumberByUuid(uuid: string): Promise<JournalReferenceNumberAttributes | null> {
        const oneJournalReferenceNumber = await JournalReferenceNumber.findOne({ where: { uuid } })
        return oneJournalReferenceNumber
    }
    public async getJournalReferenceNumberByYear(accounting_year: string): Promise<Array<JournalReferenceNumberAttributes>> {
        const allJournalReferenceNumber = await JournalReferenceNumber.findAll({ where: { accounting_year } })
        return allJournalReferenceNumber
    }
    public async addJournalReferenceNumber(number: number, accounting_year: string): Promise<ActionAttributes> {
        try {
            await JournalReferenceNumber.create({ number, accounting_year })
            return message.sendMessage(true)
        } catch (_) {
            return message.sendMessage(false)
        }
    }
    public async updateJournalReferenceNumber(number: number, accounting_year: string, uuid: string): Promise<ActionAttributes> {
        try {
            await JournalReferenceNumber.update({ number, accounting_year }, { where: { uuid } })
            return message.sendMessage(true)
        } catch (_) {
            return message.sendMessage(false)
        }
    }
    public async deleteJournalReferenceNumber(uuid: string): Promise<ActionAttributes> {
        try {
            await JournalReferenceNumber.destroy({ where: { uuid } })
            return message.sendMessage(true)
        } catch (_) {
            return message.sendMessage(false)
        }
    }
}

export default new JournalReferenceNumberLogic;
