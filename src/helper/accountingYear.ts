import AccountingYearAttributes from "../service/accountingYears/dto";
import AccountingYear from "../service/accountingYears/model";


class AccountingYearHelper {
    public async getActiveAccountingYear(): Promise<AccountingYearAttributes | null> {
        const oneAccountingYear = await AccountingYear.findOne({ where: { active: true }, attributes: ['tahun', 'active'] })
        return oneAccountingYear
    }
}

export default new AccountingYearHelper;