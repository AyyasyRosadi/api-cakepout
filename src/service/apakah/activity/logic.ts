import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import YearActiveInSystem from "../../yearActiveInSystem/model";
import Component from "../component/model";
import DetailOfActivity from "../detailOfActivities/model";
import InstitutionIncome from "../institutionIncome/model";
import Program from "../program/model";
import Realization from "../realization/model";
import SubActivity from "../subActivity/model";
import ActivityAttributes, { ActivityBreakDown, SubActivityBreakDown } from "./dto";
import Activity from "./model";
import { fn, col } from 'sequelize'
import ActivityHelper from "../../../helper/activity"

class ActivityLogic extends LogicBase {
    private async getMaxActivity(instituton_no: number, academic_year: string): Promise<number> {
        const max = await Activity.findOne({ where: { institution_no: instituton_no, academic_year }, attributes: [[fn('max', col("activity_no")), 'max']], raw: true })
        const activity: any = max;
        if (activity!.max != null) {
            return activity?.max
        }
        return 0
    }
    private async getByComponentId(component_id: string): Promise<ActivityAttributes[]> {
        const activity = await Activity.findAll({
            where: { component_id: component_id },
            include: [
                {
                    model: DetailOfActivity
                },
                {
                    model: SubActivity,
                    include: [
                        {
                            model: DetailOfActivity
                        }
                    ]
                }
            ],
        })
        return activity
    }

    
    public async getAllActivityBreakDown(compoent_id: string): Promise<messageAttribute<ActivityBreakDown[]>> {
        const activity = await this.getByComponentId(compoent_id)
        return this.message(200, await ActivityHelper.calculate(activity))
    }

    public async create(component_id: string, name: string, continue_activity: boolean): Promise<messageAttribute<defaultMessage>> {
        const component = await Component.findOne({ where: { id: component_id } })

        const program = await Program.findOne({ where: { id: component!.program_id } })
        const max = await this.getMaxActivity(program!.institution_no, program!.academic_year)
        const activity = await Activity.create({
            activity_no: max + 1,
            name: name,
            status: 0,
            component_id,
            institution_no: program!.institution_no,
            academic_year: program!.academic_year,
            continue: continue_activity,
            weight: 0
        })
        return this.message(200, { message: `${activity.id}` })
    }

    private async getActivityId(id: string): Promise<ActivityAttributes | null> {
        const activity = await Activity.findOne({
            where: { id: id },
            include: [
                {
                    model: DetailOfActivity
                }
            ]
        })
        return activity
    }

    public async delete(id: string): Promise<messageAttribute<defaultMessage>> {
        const activity: any = await this.getActivityId(id)
        const planActivity = activity.get({ plain: true })
        if (planActivity!.detail_of_activities.length > 0) {
            let detail = planActivity!.detail_of_activities
            for (let p in detail) {
                const institutionIncome = await InstitutionIncome.findOne({ where: { id: detail[p].institution_income_id } })
                await InstitutionIncome.update({ budgeted: institutionIncome!.budgeted - detail[p].total }, { where: { id: detail[p].institution_income_id } })
                await DetailOfActivity.destroy({ where: { id: detail[p].id } })
            }
        }
        await Activity.destroy({ where: { id: id } })
        return this.message(200, { message: "deleted" })
    }

    public async update(id: string, name: string,continue_activity:boolean): Promise<messageAttribute<defaultMessage>> {
        await Activity.update({ name,continue:continue_activity }, { where: { id } })
        return this.message(200, { message: "updated" })
    }

  

    public async getAllActivityByStatusBreakDown(status: number, institution_no: number): Promise<messageAttribute<ActivityBreakDown[]>> {
       const activity = await ActivityHelper.getAllActivityByStatus(status, institution_no)
       return this.message(200, activity)
    }

    public async updateStatus(status: number, id: string[]): Promise<messageAttribute<defaultMessage>> {
        for (let i in id) {
            const activity = await Activity.findOne({ where: { id: id[i] } })
            if (activity) {
                await Activity.update({ status: status }, { where: { id: id[i] } })
            }
        }
        return this.message(200, { message: "updated" })
    }

    private async generateRealization(activity_id: string, old_status: number, new_status: number): Promise<boolean> {
        const detail_of_activities = await DetailOfActivity.findAll({ where: { activity_id } })
        const academicYear = await YearActiveInSystem.findOne({ where: { name: "apakah" } });
        for (const detail of detail_of_activities) {
            const realization = await Realization.findOne({ where: { detail_of_activity_id: detail.id } })
            if ((old_status === 0 || old_status === 2) && new_status === 1 && !realization) {
                // console.log('new')
                await Realization.create({ academic_year: academicYear!.academic_year, total_budget: detail.total, total_realization: 0, detail_of_activity_id: detail.id })

            } else if (old_status === 1 && new_status === 2 && realization) {
                // console.log('remove')
                await Realization.destroy({ where: { detail_of_activity_id: detail.id } })
            }
        }
        await Activity.update({ status: new_status }, { where: { id: activity_id } })
        return true
    }

    public async updateStatusActivity(new_status: number, all_activity: any): Promise<messageAttribute<defaultMessage>> {
        for (const activity of all_activity) {
            await this.generateRealization(activity.id, activity.status, new_status)
        }
        return this.message(200, { message: 'succes' })
    }

}

export default new ActivityLogic;