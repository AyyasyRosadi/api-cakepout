import accountingYear from "../../helper/accountingYear";
import message from "../../helper/message";
import Account from "../accounts/model";
import { ActionAttributes } from "../interfaces";
import MonthlyAccountCalculationAttributes from "./dto";
import MonthlyAccountCalulation from "./model";

const include = [
    {
        model: Account,
    }
]


class MonthlyAccountCalculationLogic {
    public async getAllMonthlyAccountCalculation(): Promise<Array<MonthlyAccountCalculationAttributes>> {
        const allMonthlyAccountCalculation = await MonthlyAccountCalulation.findAll({ include: include })
        return allMonthlyAccountCalculation
    }
    public async getMonthlyAccountCalculationByUuid(uuid: string): Promise<MonthlyAccountCalculationAttributes | null> {
        const oneMonthlyAccountCalculation = await MonthlyAccountCalulation.findOne({ where: { uuid }, include: include })
        return oneMonthlyAccountCalculation
    }
    public async getMonthlyAccountCalculationByYear(year: string): Promise<Array<MonthlyAccountCalculationAttributes>> {
        const allMonthlyAccountCalculation = await MonthlyAccountCalulation.findAll({ where: { accounting_year: year }, include: include })
        return allMonthlyAccountCalculation
    }
    public async getMonthlyAccountCalculationByMonth(monthIndex: number): Promise<MonthlyAccountCalculationAttributes | null> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const oneMonthlyAccountCalculation = await MonthlyAccountCalulation.findOne({ where: { month_index: monthIndex, accounting_year: activeYear?.tahun }, include: include })
        return oneMonthlyAccountCalculation
    }
    public async addMonthlyAccountCalculation(monthIndex: number, accountingYear: string, total: number, accountId: string, open: boolean): Promise<ActionAttributes> {
        try {
            await MonthlyAccountCalulation.create({
                month_index: monthIndex,
                account_id: accountId,
                accounting_year: accountingYear,
                open,
                total
            })
            return message.sendMessage(true)
        } catch (_) {
            return message.sendMessage(false)
        }
    }
    public async updateTotalMonthlyAccountCalculation(total: number, uuid: string): Promise<ActionAttributes> {
        try {
            const oneMonthlyAccountCalculation = await this.getMonthlyAccountCalculationByUuid(uuid)
            if (!oneMonthlyAccountCalculation || !oneMonthlyAccountCalculation.open) {
                return message.sendMessage(false)
            }
            let result: number = oneMonthlyAccountCalculation.total + total
            await MonthlyAccountCalulation.update({
                total: result
            }, {
                where: { uuid }
            })
            return message.sendMessage(true)
        } catch {
            return message.sendMessage(false)
        }
    }
    public async updateOpenMonthlyAccountCalculation(open: boolean, uuid: string): Promise<ActionAttributes> {
        try {
            await MonthlyAccountCalulation.update({
                open: open
            }, {
                where: { uuid }
            })
            return message.sendMessage(true)
        } catch {
            return message.sendMessage(false)
        }
    }
    public async deleteMonthlyAccountCalculation(uuid: string): Promise<ActionAttributes> {
        try {
            await MonthlyAccountCalulation.destroy({
                where: { uuid }
            })
            return message.sendMessage(true)
        } catch {
            return message.sendMessage(false)
        }
    }

}

export default new MonthlyAccountCalculationLogic;