import { Op } from "sequelize"
import ActivityAttributes from "../service/apakah/activity/dto"
import Activity from "../service/apakah/activity/model"
import { DetailOfActivityAttributes } from "../service/apakah/detailOfActivities/dto"
import DetailOfActivity from "../service/apakah/detailOfActivities/model"
import DisbursementOfFundAttributes, { GroupingDisbursementOfFund } from "../service/cakepout/disbursementOfFund/dto"
import DisbursementOfFunds from "../service/cakepout/disbursementOfFund/model"

class DisbursementOfFundHelper {
    private include = [{ model: DetailOfActivity }]
    public async getDisbursementOfFundBySharingProgram(sharing_program_id: string, status: number): Promise<Array<DisbursementOfFundAttributes>> {
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { sharing_program_id, status, withdraw: false }, include: this.include })
        return allDisbursementOfFund
    }
    public async getDisbursementOfFundByUuid(uuid: string): Promise<DisbursementOfFundAttributes> {
        const oneDisbursementOfFund = await DisbursementOfFunds.findOne({ where: { uuid }, include: this.include })
        return oneDisbursementOfFund!
    }

    public async checkHasDisbursementOfFundByDetailActivity(detail_of_activity_id: string): Promise<boolean> {
        const oneDisbursementOfFund = await DisbursementOfFunds.findOne({ where: { detail_of_activity_id, status: { [Op.not]: 3 } } })
        if (oneDisbursementOfFund) {
            return true
        }
        return false
    }

    public async groupingDisbursementOfFund(data: Array<DisbursementOfFundAttributes>): Promise<Array<any>> {
        let result: Array<GroupingDisbursementOfFund> = []
        for (let value of data) {
            if (value.sharing_program_id) {
                const find = result.find((value) => value.sharing_program_id === value.sharing_program_id)
                if (find) {
                    find.amount += value.amount
                    find.detail_of_activities?.push(value.detail_of_activity!)
                } else {
                    result.push({ accounting_year: value.accounting_year, amount: value.amount, ptk_id: value.ptk_id, receipient: value.recipient, reference_of_journal: value.reference_of_jurnal, sharing_program_id: value.sharing_program_id, sharing_program_name: value.sharing_programs!.name, status: value.status, withdraw: value.withdraw, id: value.uuid, uraian: value.detail_of_activity?.description!, detail_of_activity_id: value.detail_of_activity_id, detail_of_activities: [value.detail_of_activity!] })
                }
            }
            else {
                result.push({ accounting_year: value.accounting_year, amount: value.amount, ptk_id: value.ptk_id, receipient: value.recipient, reference_of_journal: value.reference_of_jurnal, sharing_program_id: null, sharing_program_name: null, status: value.status, withdraw: value.withdraw, id: value.uuid, uraian: value?.detail_of_activity!.description, detail_of_activity_id: value.detail_of_activity_id, detail_of_activities: [value.detail_of_activity!] })
            }
        }
        return result
    }

    private async getActivity(institutionNo: number, status: number): Promise<ActivityAttributes[]> {
        const activity = await Activity.findAll({
            where: {
                institution_no: institutionNo,
            },
            include: [
                {
                    model: DetailOfActivity,

                }
            ]
        })
        return activity.map((e: any) => e.get({ plain: true }))
    }

    public async activityDisbrusmentOfFund(institution_no: number, status: number): Promise<ActivityAttributes[]> {
        const data: any = await this.getActivity(institution_no, status)
        let finalData: ActivityAttributes[] = []
        const monthNow = new Date().getMonth() + 1
        for (const a of data) {
            let detailOfActivity: DetailOfActivityAttributes[] = []
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
        return finalData

    }

    public async createDisbursementOfFund(accounting_year: string, detail_of_activity_id: string, amount: number, month_index: number, sharing_program: boolean, sharing_program_id: string): Promise<void> {
        await DisbursementOfFunds.create({
            accounting_year,
            detail_of_activity_id,
            amount,
            month_index,
            sharing_program,
            status: 0,
            withdraw: false,
            sharing_program_id: sharing_program ? sharing_program_id : null
        })
    }

    public async updateStatusDsibursementOfFund(uuid: string, status: number): Promise<void> {
        await DisbursementOfFunds.update({ status }, { where: { uuid } })
    }


}

export default new DisbursementOfFundHelper