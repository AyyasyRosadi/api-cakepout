import message from "../../helper/message";
import { ActionAttributes } from "../interfaces";
import AccountingYearAttributes from "./dto";
import AccountingYear from "./model";

const attributes = ['tahun', 'active']

class AccountingYearLogic {
    public async getAllAccountYear(): Promise<Array<AccountingYearAttributes>> {
        const allAccountingYear = await AccountingYear.findAll({ attributes: attributes,order:[['active','DESC'],['createdAt','DESC']] })
        return allAccountingYear
    }
    public async getAccountingYearByStatus(status: number): Promise<Array<AccountingYearAttributes>> {
        const allAccountingYear = await AccountingYear.findAll({ where: { active: status }, attributes: attributes,order:[['active','DESC'],['createdAt','DESC']] })
        return allAccountingYear
    }
    public async addAccountingYear(year: string, active: boolean): Promise<ActionAttributes> {
        try {
            await AccountingYear.create({ tahun: year, active: active })
            return message.sendMessage(true)
        } catch (_) {
            return message.sendMessage(false)
        }
    }
    public async updateStatusAccountingYear(year: string, status: boolean): Promise<ActionAttributes> {
        try {
            await AccountingYear.update({ active: status }, { where: { tahun: year } })
            return message.sendMessage(true)
        } catch (_) {
            return message.sendMessage(false)
        }
    }
    public async deleteAccountingYear(year: string): Promise<ActionAttributes> {
        try {
            await AccountingYear.destroy({ where: { tahun: year } })
            return message.sendMessage(true)
        } catch (_) {
            return message.sendMessage(false)

        }
    }
}

export default new AccountingYearLogic