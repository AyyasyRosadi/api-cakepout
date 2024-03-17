import { ActionAttributes } from "../interfaces";
import AccountingYearAttributes from "./dto";
import AccountingYear from "./model";


class AccountingYearLogic {
    public async getAllAccountYear(): Promise<Array<AccountingYearAttributes>> {
        const allAccountingYear = await AccountingYear.findAll()
        return allAccountingYear
    }
    public async getAccountingYearByStatus(status: number): Promise<Array<AccountingYearAttributes>> {
        const allAccountingYear = await AccountingYear.findAll({ where: { active: status } })
        return allAccountingYear
    }
    public async addAccountingYear(year: string, active: boolean): Promise<ActionAttributes> {
        try {
            await AccountingYear.create({ tahun: year, active: active })
            return { status: true, message: 'create accounting year succes' }
        } catch (_) {
            return { status: false, message: 'bad request' }
        }
    }
    public async updateStatusAccountingYear(year: string, status: boolean): Promise<ActionAttributes> {
        try {
            await AccountingYear.update({ active: status }, { where: { tahun: year } })
            return { status: true, message: 'update accounting year succes' }
        } catch (_) {
            return { status: false, message: 'bad request' }
        }
    }
    public async deleteAccountingYear(year: string): Promise<ActionAttributes> {
        try {
            await AccountingYear.destroy({ where: { tahun: year } })
            return { status: true, message: 'delete accounting year succes' }
        } catch (_) {
            return { status: false, message: 'bad request' }

        }
    }
}

export default new AccountingYearLogic