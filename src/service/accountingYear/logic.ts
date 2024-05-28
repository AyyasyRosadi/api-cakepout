// import {  Order } from "sequelize";
import { LogicBase, defaultMessage, messageAttribute } from "../logicBase";
import AccountingYearAttributes from "./dto";
import AccountingYear from "./model";


class AccountingYearLogic extends LogicBase {
    private attributes:Array<string> = ['tahun', 'active']
    // private order: Order = [['active', 'DESC'], ['createdAt', 'DESC']]
    private order:Array<Array<string>|any> = [['active', 'DESC'], ['createdAt', 'DESC']]

    public async getAllAccountYear(): Promise<messageAttribute<Array<AccountingYearAttributes>>> {
        const allAccountingYear = await AccountingYear.findAll({ attributes: this.attributes, order: this.order })
        return this.message(200, allAccountingYear)
    }
    public async getAccountingYearByStatus(status: number): Promise<messageAttribute<Array<AccountingYearAttributes>>> {
        const allAccountingYear = await AccountingYear.findAll({ where: { active: status }, attributes: this.attributes, order: this.order })
        return this.message(200, allAccountingYear)
    }
    public async addAccountingYear(year: string, active: boolean): Promise<messageAttribute<defaultMessage>> {
        try {
            await AccountingYear.create({ tahun: year, active: active })
            return this.message(200, { message: "Succes" })
        } catch (_) {
            return this.message(403, { message: "Gagal" })
        }
    }
    public async updateStatusAccountingYear(year: string, status: boolean): Promise<messageAttribute<defaultMessage>> {
        try {
            await AccountingYear.update({ active: status }, { where: { tahun: year } })
            return this.message(200, { message: "Succes" })
        } catch (_) {
            return this.message(403, { message: "Gagal" })
        }
    }
    public async deleteAccountingYear(year: string): Promise<messageAttribute<defaultMessage>> {
        try {
            await AccountingYear.destroy({ where: { tahun: year } })
            return this.message(200, { message: "Succes" })
        } catch (_) {
            return this.message(403, { message: "Gagal" })

        }
    }
}

export default new AccountingYearLogic