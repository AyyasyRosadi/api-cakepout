import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import { DetailOfActivityAttributes, detailOfActivityList } from "./dto";
import DetailOfActivity from "./model";
import InstitutionIncome from "../institutionIncome/model";
import { where } from "sequelize";


class DetailOfActivityLogic extends LogicBase {
    public async getByActivityId(activityId: string): Promise<messageAttribute<DetailOfActivityAttributes[]>> {
        return this.message(200, await DetailOfActivity.findAll({
            where: { activity_id: activityId }, include: [
                {
                    model: InstitutionIncome,
                    attributes: ["name"]
                }
            ]
        }))
    }

    public async getBySubActivityId(subActivityId: string): Promise<messageAttribute<DetailOfActivityAttributes[]>> {
        return this.message(200, await DetailOfActivity.findAll({
            where: { sub_activity_id: subActivityId },
            include: [
                {
                    model: InstitutionIncome,
                    attributes: ["name"]
                }
            ]
        }))
    }
    public async create(activity_id: string, sub_activity_id: string | null, detailOfActivityList: Array<detailOfActivityList>): Promise<messageAttribute<defaultMessage>> {
        for (let d in detailOfActivityList) {
            const institutionIncome = await InstitutionIncome.findOne({ where: { id: detailOfActivityList[d].institution_income_id } })
            if ((institutionIncome!.total - institutionIncome!.budgeted) >= detailOfActivityList[d].total) {
                await DetailOfActivity.create({
                    description: detailOfActivityList[d].description,
                    unit_id: detailOfActivityList[d].unit_id,
                    vol: detailOfActivityList[d].vol,
                    unit_price: detailOfActivityList[d].unit_price,
                    thawing_method: detailOfActivityList[d].thawing_method,
                    from: detailOfActivityList[d].from,
                    until: detailOfActivityList[d].until,
                    total: detailOfActivityList[d].total,
                    academic_year: detailOfActivityList[d].academic_year,
                    sharing_program: detailOfActivityList[d].sharing_program,
                    post: detailOfActivityList[d].post,
                    sub_activity_id: sub_activity_id,
                    activity_id: activity_id,
                    institution_income_id: detailOfActivityList[d].institution_income_id

                })
                await InstitutionIncome.update({
                    budgeted: institutionIncome!.budgeted + detailOfActivityList[d].total,
                }, { where: { id: detailOfActivityList[d].institution_income_id } })
            } else {
                return this.message(400, { message: `biaya detail kegiatan '${detailOfActivityList[d].description}'` })
            }
        }
        return this.message(200, { message: "saved" });
    }

    public async delete(id: string): Promise<messageAttribute<defaultMessage>> {
        const detail = await DetailOfActivity.findOne({ where: { id: id } })
        const institutionIncome = await InstitutionIncome.findOne({ where: { id: detail!.institution_income_id } })
        await InstitutionIncome.update({ budgeted: institutionIncome!.budgeted - detail!.total }, { where: { id: detail!.institution_income_id } })
        await DetailOfActivity.destroy({ where: { id: id } })
        return this.message(200, { message: "deleted" })
    }

    private async getDetailOfActivityById(id: string): Promise<DetailOfActivityAttributes | null> {
        return await DetailOfActivity.findOne({ where: { id } })
    }

    public async update(id: string, detailOfActivity: detailOfActivityList): Promise<messageAttribute<defaultMessage>> {
        const getDetailOfActivitiy = await this.getDetailOfActivityById(id)
        const institutionIncomeOld = await InstitutionIncome.findOne({ where: { id: getDetailOfActivitiy!.institution_income_id } })
        if (getDetailOfActivitiy) {
            const totalDetailOfActivity = getDetailOfActivitiy.total;
            const budgetOld = institutionIncomeOld!.budgeted;
            const budgetUpdateOld = (budgetOld - totalDetailOfActivity) + detailOfActivity.total
            if (getDetailOfActivitiy.institution_income_id === detailOfActivity.institution_income_id) {
                if (institutionIncomeOld!.total >= budgetUpdateOld) {
                    await InstitutionIncome.update({ budgeted: budgetUpdateOld }, { where: { id: detailOfActivity.institution_income_id } })
                    await DetailOfActivity.update(detailOfActivity, { where: { id: id } })
                    return this.message(200, { message: "updated" })
                }

            } else {
                const institutionIncomeNew = await InstitutionIncome.findOne({ where: { id: detailOfActivity.institution_income_id } })
                const budgetUpdateNew = institutionIncomeNew!.budgeted + detailOfActivity.total
                if (institutionIncomeNew!.total >= budgetUpdateNew) {
                    await InstitutionIncome.update({ budgeted: budgetOld - totalDetailOfActivity }, { where: { id: getDetailOfActivitiy.institution_income_id } })
                    await InstitutionIncome.update({ budgeted: budgetUpdateNew }, { where: { id: detailOfActivity.institution_income_id } })
                    await DetailOfActivity.update(detailOfActivity, { where: { id: id } })
                    return this.message(200, { message: "updated" })
                }
            }
            return this.message(400, { message: "tidak bisa diupdate dikarenakan biaya lebih besar dari anggaran!" })
        }
        return this.message(400, { message: "uuups" })
    }
}

export default new DetailOfActivityLogic;