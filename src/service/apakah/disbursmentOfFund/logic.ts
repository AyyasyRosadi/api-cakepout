import disbursementOfFund from "../../../helper/disbursementOfFund";
import monthConverter from "../../../helper/monthConverter";
import realization from "../../../helper/realization";
import { AddDisbursementOfFund } from "../../cakepout/disbursementOfFund/dto";
import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";
import ActivityAttributes from "../activity/dto";
import Activity from "../activity/model";
import { DetailOfActivityAttributes } from "../detailOfActivities/dto";
import DetailOfActivity from "../detailOfActivities/model";
import Realization from "../realization/model";

class DisbrusmentOfFundLogicApakah extends LogicBase {
    private async getDetailOfActivity(institutionNo: number): Promise<ActivityAttributes[]> {
        const activity = await Activity.findAll({
            where: {
                institution_no: institutionNo,
                status: 1
            },
            include: [
                {
                    model: DetailOfActivity
                }
            ]
        })
        return activity.map((e: any) => e.get({ plain: true }))
    }

    public async activity(institution_no: number): Promise<messageAttribute<ActivityAttributes[]>> {
        const data: any = await this.getDetailOfActivity(institution_no)
        let finalData: ActivityAttributes[] = []
        const monthNow = monthConverter.transformMonth(new Date().getMonth() + 1)
        for (const a of data) {
            let detailOfActivity: DetailOfActivityAttributes[] = []
            // console.log(a.detail_of_activities)
            if (a.detail_of_activities!.length !== 0) {
                for (const d of a.detail_of_activities) {
                    if (d.from <= monthNow && d.until >= monthNow) {
                        detailOfActivity.push(d)
                    }
                }
                let newActivity = a;
                newActivity.detail_of_activities = detailOfActivity;
                finalData.push(newActivity);
            }

        }
        return this.message(200, finalData)

    }

    private async generateRealization(year: string, totalBudget: number, totalRealization: number, detailOfActivityId: string): Promise<void> {
        await Realization.create({
            academic_year: year,
            total_budget: totalBudget,
            total_realization: totalRealization,
            detail_of_activity_id: detailOfActivityId
        })
    }

    public async addDisbursementOfFund(detail_of_activities: Array<AddDisbursementOfFund>, sharing_program_id: string): Promise<messageAttribute<defaultMessage>> {
        for (let a of detail_of_activities) {
            const checkAmount = await realization.checkAmountRealizations(a?.uuid, a?.amount)
            const checkExist = await disbursementOfFund.checkHasDisbursementOfFundByDetailActivity(a.uuid)
            if (!checkAmount || checkExist) {
                return this.message(500, { message: "Failed" })
            }
        }
        const month = new Date().getMonth()
        for (let data of detail_of_activities) {
            await disbursementOfFund.createDisbursementOfFund(data.accounting_year, data.uuid, data.amount, month, data.sharing_program, sharing_program_id)
        }
        return this.message(200, { message: "Succes" })
    }


    // public async approvalRealization():{
    //     const year = await YearActiveInSystemHelper.getYear("apakah");
    // }


}

export default new DisbrusmentOfFundLogicApakah;