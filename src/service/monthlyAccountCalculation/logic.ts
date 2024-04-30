import { Includeable } from "sequelize";
import accountingYear from "../../helper/accountingYear";
import Account from "../account/model";
import GroupAccount from "../groupAccount/model";
import { MonthlyAccountCalculationAttributes, MonthlyAccountCalculationPaginationAttributes } from "./dto";
import MonthlyAccountCalulation from "./model";
import { LogicBase, defaultMessage, messageAttribute } from "../logicBase";


class MonthlyAccountCalculationLogic extends LogicBase {
    private include: Includeable = {
        model: Account,
        include: [{
            model: GroupAccount
        }]
    }

    public async getAllMonthlyAccountCalculation(page: number, size: number): Promise<messageAttribute<MonthlyAccountCalculationPaginationAttributes>> {
        const offset = (page - 1) * size
        const allMonthlyAccountCalculation = await MonthlyAccountCalulation.findAndCountAll(
            {
                limit: size,
                offset: offset,
                include: this.include,
                order: [["accounting_year", "DESC"], ['month_index', 'DESC']]
            }
        )
        return this.message(200, {
            page,
            totalPages: Math.ceil(allMonthlyAccountCalculation.count / size),
            totalItems: allMonthlyAccountCalculation.count,
            data: allMonthlyAccountCalculation.rows
        })
    }
    public async getMonthlyAccountCalculationByUuid(uuid: string): Promise<messageAttribute<MonthlyAccountCalculationAttributes | defaultMessage>> {
        const oneMonthlyAccountCalculation = await MonthlyAccountCalulation.findOne({ where: { uuid }, include: this.include })
        return this.message(oneMonthlyAccountCalculation ? 200 : 404, oneMonthlyAccountCalculation ? oneMonthlyAccountCalculation : { message: "Kalkulasi tidak ditemukan" })
    }
    public async getMonthlyAccountCalculationByYear(year: string): Promise<messageAttribute<Array<MonthlyAccountCalculationAttributes>>> {
        const allMonthlyAccountCalculation = await MonthlyAccountCalulation.findAll({ where: { accounting_year: year }, include: this.include })
        return this.message(200, allMonthlyAccountCalculation)
    }
    public async getMonthlyAccountCalculationByMonth(monthIndex: number): Promise<messageAttribute<MonthlyAccountCalculationAttributes | defaultMessage>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const oneMonthlyAccountCalculation = await MonthlyAccountCalulation.findOne({ where: { month_index: monthIndex, accounting_year: activeYear?.tahun }, include: this.include })
        return this.message(oneMonthlyAccountCalculation ? 200 : 404, oneMonthlyAccountCalculation ? oneMonthlyAccountCalculation : { message: "Kalkulasi tidak ditemukan" })
    }
    private async checkMonthlyAccountCalculation(month_index: number, accounting_year: string, account_id: string): Promise<boolean> {
        const oneMonthlyAccountCalculation = await MonthlyAccountCalulation.findOne({ where: { month_index, accounting_year, account_id } })
        return oneMonthlyAccountCalculation ? true : false
    }
    public async addMonthlyAccountCalculation(month_index: number, accounting_year: string, total: number, account_id: string, open: boolean): Promise<messageAttribute<defaultMessage>> {
        try {
            const oneMonthlyAccountCalculation = await this.checkMonthlyAccountCalculation(month_index, accounting_year, account_id)
            if (oneMonthlyAccountCalculation) {
                return this.message(403, { message: "Data sudah ada sebelumnnya" })
            }
            await MonthlyAccountCalulation.create({
                month_index: month_index,
                account_id: account_id,
                accounting_year: accounting_year,
                open,
                total
            })
            return this.message(200, { message: "Succes" })
        } catch (_) {
            return this.message(403, { message: "Gagal" })
        }
    }
    public async updateTotalMonthlyAccountCalculation(total: number, uuid: string): Promise<messageAttribute<defaultMessage>> {
        try {
            const oneMonthlyAccountCalculation = await this.getMonthlyAccountCalculationByUuid(uuid)
            const monthlyAccountCalculation = oneMonthlyAccountCalculation.data as MonthlyAccountCalculationAttributes
            if (oneMonthlyAccountCalculation.status !== 200 || !monthlyAccountCalculation.open) {
                return this.message(403, { message: "Kalkulasi sudah ditutup" })
            }
            let result: number = monthlyAccountCalculation.total + total
            await MonthlyAccountCalulation.update({
                total: result
            }, {
                where: { uuid }
            })
            return this.message(200, { message: "Succes" })
        } catch {
            return this.message(403, { message: "Gagal" })
        }
    }
    
    public async deleteMonthlyAccountCalculation(uuid: string): Promise<messageAttribute<defaultMessage>> {
        try {
            await MonthlyAccountCalulation.destroy({
                where: { uuid }
            })
            return this.message(200, { message: "Succes" })
        } catch {
            return this.message(403, { message: "Gagal" })
        }
    }

}

export default new MonthlyAccountCalculationLogic;