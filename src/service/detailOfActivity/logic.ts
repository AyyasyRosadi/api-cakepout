import { Includeable } from "sequelize";
import accountingYear from "../../helper/accountingYear";
import Activity from "../activity/model";
import Component from "../component/model";
import Institution from "../institution/model";
import { LogicBase, defaultMessage, messageAttribute } from "../logicBase";
import Program from "../program/model";
import DetailOfActivityAttributes from "./dto";
import DetailOfActivity from "./model";


class DetailOfActivityLogic extends LogicBase {
    private include: Includeable = {
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
    public async getAllDetailOfActivity(): Promise<messageAttribute<Array<DetailOfActivityAttributes>>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDetailOfActivity = await DetailOfActivity.findAll({ where: { tahun_ajar: activeYear?.tahun }, include: this.include })
        return this.message(200, allDetailOfActivity)
    }
    public async getOneDetailActivityByUuid(uuid: string): Promise<messageAttribute<DetailOfActivityAttributes | defaultMessage>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const oneDetailOfActivity = await DetailOfActivity.findOne({ where: { uuid, tahun_ajar: activeYear?.tahun }, include: this.include })
        return this.message(oneDetailOfActivity ? 200 : 404, oneDetailOfActivity ? oneDetailOfActivity : { message: "Rincian tidak ditemukan" })
    }
    public async getAllDetailOfActivityByYear(accounting_year: string): Promise<messageAttribute<Array<DetailOfActivityAttributes>>> {
        const allDetailOfActivity = await DetailOfActivity.findAll({ where: { tahun_ajar: accounting_year }, include: this.include })
        return this.message(200, allDetailOfActivity)
    }
    public async getAllDetailOfActivityByInstitution(institutionId: number): Promise<messageAttribute<Array<DetailOfActivityAttributes>>> {
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
        return this.message(200, allDetailOfActivity)
    }
}

export default new DetailOfActivityLogic;