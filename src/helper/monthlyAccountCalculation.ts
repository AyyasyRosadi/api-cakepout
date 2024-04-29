import { MonthlyAccountCalculationAttributes } from "../service/monthlyAccountCalculation/dto";
import MonthlyAccountCalulation from "../service/monthlyAccountCalculation/model";
import accountingYear from "./accountingYear";


class MonthlyAccountCalculationHelper {
    public async getActiveOneMonthlyAccountCalculation(month: number, year: string, account_id: string): Promise<MonthlyAccountCalculationAttributes> {
        const oneMonthlyAccountCalculation = await MonthlyAccountCalulation.findOne({ where: { month_index: month, accounting_year: year, account_id: account_id, open: true } })
        return oneMonthlyAccountCalculation!
    }
    public async createMonthlyAccountCalculation(month_index: number, accounting_year: string, account_id: string, total: number): Promise<boolean> {
        try {
            await MonthlyAccountCalulation.create({ month_index, accounting_year, account_id, open: true, total })
            return true
        } catch {
            return false
        }
    }
    public async updateTotalMonthlyAccountCalculation(total: number, uuid: string): Promise<boolean> {
        try {
            await MonthlyAccountCalulation.update({ total }, { where: { uuid } })
            return true
        } catch {
            return false
        }
    }
    public async getMonthlyAccountCalculationByAccountId(account_id: string): Promise<MonthlyAccountCalculationAttributes[]> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allMonthlyAccountCalculation = await MonthlyAccountCalulation.findAll({ where: { account_id, accounting_year: activeYear!.tahun } })
        return allMonthlyAccountCalculation
    }
}

export default new MonthlyAccountCalculationHelper