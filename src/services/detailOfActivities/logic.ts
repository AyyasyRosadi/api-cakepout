import accountingYear from "../../helper/accountingYear";
import Activity from "../activities/model";
import Component from "../components/model";
import Institution from "../institutions/model";
import Program from "../programs/model";
import DetailOfActivityAttributes from "./dto";
import DetailOfActivity from "./model";


const include = [
    {
        model: Activity,
        attributes: ['no_komponen'],
        include: [{
            model: Component,
            attributes: ['no_program'],
            include: [{
                model: Program,
                attributes: ['no_lembaga'],
                include: [{
                    model: Institution,
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                }]
            }]
        }]
    }
]

class DetailOfActivityLogic {
    public async getAllDetailOfActivity(): Promise<Array<DetailOfActivityAttributes>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDetailOfActivity = await DetailOfActivity.findAll({ where: { tahun_ajar: activeYear?.tahun }, include: include })
        return allDetailOfActivity
    }
    public async getOneDetailActivityByUuid(uuid: string): Promise<DetailOfActivityAttributes | null> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const oneDetailOfActivity = await DetailOfActivity.findOne({ where: { uuid, tahun_ajar: activeYear?.tahun }, include: include })
        return oneDetailOfActivity ? oneDetailOfActivity : null
    }
    public async getAllDetailOfActivityByYear(accounting_year: string): Promise<Array<DetailOfActivityAttributes>> {
        const allDetailOfActivity = await DetailOfActivity.findAll({ where: { tahun_ajar: accounting_year }, include: include })
        return allDetailOfActivity
    }
}

export default new DetailOfActivityLogic;