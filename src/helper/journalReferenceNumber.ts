import JournalReferenceNumberAttributes from "../service/journalReferenceNumber/dto"
import JournalReferenceNumber from "../service/journalReferenceNumber/model"
import accountingYear from "./accountingYear"

class JournalReferenceNumberHelper {
    private async getOneJournalReferenceNumberByYear(year: string): Promise<JournalReferenceNumberAttributes | null> {
        return await JournalReferenceNumber.findOne({ where: { accounting_year: year } })
    }
    private async createJournalReferenceNumber(year: string): Promise<boolean> {
        try {
            await JournalReferenceNumber.create({ accounting_year: year, number: 1 })
            return true
        } catch {
            return false
        }
    }
    public async generateReference(): Promise<string | null> {
        try {
            const activeYear = await accountingYear.getActiveAccountingYear()
            const oneJournalReferenceNumber = await this.getOneJournalReferenceNumberByYear(activeYear!.tahun)
            let referenceNumber = ""
            let prefix = ""
            let yaerPrefix = activeYear!.tahun.split('/')[1].substring(2)
            if (!oneJournalReferenceNumber) {
                await this.createJournalReferenceNumber(activeYear!.tahun)
                referenceNumber = "1"
            } else {
                referenceNumber = `${oneJournalReferenceNumber.number + 1}`
            }
            for (let i = 0; i < 5 - referenceNumber.length; i++) {
                prefix += "0"
            }
            return `${yaerPrefix}-${prefix + referenceNumber}`
        } catch {
            return null
        }
    }
}

export default new JournalReferenceNumberHelper