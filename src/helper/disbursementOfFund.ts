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

    public async groupingDisbursementOfFund(data: Array<DisbursementOfFundAttributes>): Promise<Array<any>> {
        let result: Array<GroupingDisbursementOfFund> = []
        for (let i in data) {
            if (data[i].sharing_program_id) {
                const find = result.find((value) => value.sharing_program_id === data[i].sharing_program_id)
                if (find) {
                    find.amount += data[i].amount
                    find.activity_id += `/${data[i].rincian_kegiatan?.activity_id}`
                    find.activity?.push(data[i])
                } else {
                    result.push({ accounting_year: data[i].accounting_year, amount: data[i].amount, ptk_id: data[i].ptk_id, receipient: data[i].recipient, reference_of_journal: data[i].reference_of_jurnal, sharing_program_id: data[i].sharing_program_id, sharing_program_name: data[i].sharing_programs!.name, status: data[i].status, withdraw: data[i].withdraw, uuid: data[i].uuid, uraian: data[i].rincian_kegiatan!.description, activity_id: data[i].rincian_kegiatan!.activity_id, activity: [data[i]] })
                }
            } else {
                result.push({ accounting_year: data[i].accounting_year, amount: data[i].amount, ptk_id: data[i].ptk_id, receipient: data[i].recipient, reference_of_journal: data[i].reference_of_jurnal, sharing_program_id: null, sharing_program_name: null, status: data[i].status, withdraw: data[i].withdraw, uuid: data[i].uuid, uraian: data[i].rincian_kegiatan!.description, activity_id: data[i].rincian_kegiatan!.activity_id })
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

    public async updateStatusDsibursementOfFund(uuid: string, status: number): Promise<void> {
        await DisbursementOfFunds.update({ status }, { where: { uuid } })
    }


}

export default new DisbursementOfFundHelper