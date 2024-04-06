import accountingYear from "../../helper/accountingYear";
import Activity from "../activity/model";
import Component from "../component/model";
import Institution from "../institution/model";
import Program from "../program/model";
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
    public async getAllDetailOfActivityByInstitution(institutionId: number): Promise<Array<DetailOfActivityAttributes>> {
        const allDetailOfActivity = await DetailOfActivity.findAll({
            include: {
                model: Activity,
                required: true,
                attributes: ['no_komponen'],
                include: [{
                    model: Component,
                    required: true,
                    attributes: ['no_program'],
                    include: [{
                        model: Program,
                        required: true,
                        attributes: ['no_lembaga'],
                        include: [{
                            model: Institution,
                            where: { no_lembaga: institutionId },
                            required: true,
                            attributes: { exclude: ['createdAt', 'updatedAt'] }
                        }]
                    }]
                }]
            }
        })
        return allDetailOfActivity
    }
}

export default new DetailOfActivityLogic;