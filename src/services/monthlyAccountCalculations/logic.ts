import MonthlyAccountCalculationAttributes from "./dto";
import MonthlyAccountCalulation from "./model";


class MonthlyAccountCalculationLogic {
    public async getAllMonthlyAccountCalculation(): Promise<Array<MonthlyAccountCalculationAttributes>> {
        const allMonthlyAccountCalculation = await MonthlyAccountCalulation.findAll()
        return allMonthlyAccountCalculation
    }
    public async getMonthlyAccountCalculationByUuid(uuid: string): Promise<MonthlyAccountCalculationAttributes | null> {
        const oneMonthlyAccountCalculation = await MonthlyAccountCalulation.findOne({ where: { uuid } })
        return oneMonthlyAccountCalculation
    }
}