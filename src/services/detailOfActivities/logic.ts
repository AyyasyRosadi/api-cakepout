import accountingYear from "../../helper/accountingYear";
import DetailOfActivityAttributes from "./dto";
import DetailOfActivity from "./model";


class DetailOfActivityLogic {
    public async getAllDetailOfActivity(): Promise<Array<DetailOfActivityAttributes>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDetailOfActivity = await DetailOfActivity.findAll({ where: { tahun_ajar: activeYear?.tahun } })
        return allDetailOfActivity
    }
    public async getOneDetailActivityByUuid(uuid: string): Promise<DetailOfActivityAttributes | null> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const oneDetailOfActivity = await DetailOfActivity.findOne({ where: { uuid, tahun_ajar: activeYear?.tahun } })
        return oneDetailOfActivity ? oneDetailOfActivity : null
    }
    public async getAllDetailOfActivityByYear(accounting_year: string): Promise<Array<DetailOfActivityAttributes>> {
        const allDetailOfActivity = await DetailOfActivity.findAll({ where: { tahun_ajar: accounting_year } })
        return allDetailOfActivity
    }
}

export default new DetailOfActivityLogic;