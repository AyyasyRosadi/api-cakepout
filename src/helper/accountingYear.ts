import AccountingYearAttributes from "../services/accountingYears/dto";
import AccountingYear from "../services/accountingYears/model";


class AccountingYearHelper {
    public async getActiveAccountingYear(): Promise<AccountingYearAttributes | null> {
        const oneAccountingYear = await AccountingYear.findOne({ where: { active: true }, attributes: ['tahun', 'active'] })
        return oneAccountingYear
    }
}

export default new AccountingYearHelper;