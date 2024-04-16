import accountingYear from "../../helper/accountingYear";
import message from "../../helper/message";
import Account from "../account/model";
import GroupAccount from "../groupAccount/model";
import { ActionAttributes } from "../interfaces";
import MonthlyAccountCalculationAttributes from "./dto";
import MonthlyAccountCalulation from "./model";

const include = [
    {
        model: Account,
        include: [{
            model: GroupAccount
        }]
    }
]

interface MonthlyAccountCalculationPaginationAttributes {
    page: number;
    totalPages: number;
    totalItems: number;
    data: Array<MonthlyAccountCalculationAttributes>;
}


class MonthlyAccountCalculationLogic {
    public async getAllMonthlyAccountCalculation(page: number, size: number): Promise<MonthlyAccountCalculationPaginationAttributes> {
        const offset = (page - 1) * size
        const allMonthlyAccountCalculation = await MonthlyAccountCalulation.findAndCountAll(
            {
                limit: size,
                offset: offset,
                include: include,
                order: [["accounting_year", "DESC"], ['month_index', 'DESC']]
            }
        )
        return {
            page,
            totalPages: Math.ceil(allMonthlyAccountCalculation.count / size),
            totalItems: allMonthlyAccountCalculation.count,
            data: allMonthlyAccountCalculation.rows
        }
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
    private async checkMonthlyAccountCalculation(month_index: number, accounting_year: string, account_id: string): Promise<boolean> {
        const oneMonthlyAccountCalculation = await MonthlyAccountCalulation.findOne({ where: { month_index, accounting_year, account_id } })
        return oneMonthlyAccountCalculation ? true : false
    }
    public async addMonthlyAccountCalculation(month_index: number, accounting_year: string, total: number, account_id: string, open: boolean): Promise<ActionAttributes> {
        try {
            const oneMonthlyAccountCalculation = await this.checkMonthlyAccountCalculation(month_index, accounting_year, account_id)
            if(oneMonthlyAccountCalculation){
                return message.sendMessage(false,'Data exist')
            }
            await MonthlyAccountCalulation.create({
                month_index: month_index,
                account_id: account_id,
                accounting_year: accounting_year,
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