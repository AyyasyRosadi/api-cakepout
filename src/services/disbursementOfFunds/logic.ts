import detailOfActivities from "../../helper/detailOfActivities";
import DetailOfActivity from "../detailOfActivities/model";
import DisbursementOfFundAttributes from "./dto";
import DisbursementOfFunds from "./model";



class DisbursementOfFundLogic {
    public async getAllDisbursementOfFund(): Promise<Array<DisbursementOfFundAttributes>> {
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ include: { model: DetailOfActivity } })
        return allDisbursementOfFund
    }
    public async getDisbursementOfFundByUuid(uuid: string): Promise<DisbursementOfFundAttributes | null> {
        const oneDisbursementOfFund = await DisbursementOfFunds.findOne({ where: { uuid: uuid }, include: { model: DetailOfActivity } })
        return oneDisbursementOfFund ? oneDisbursementOfFund : null
    }
    public async getDisbursementOfFundByActivityId(activity_id: string): Promise<Array<DisbursementOfFundAttributes>> {
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { activity_id: activity_id }, include: { model: DetailOfActivity } })
        return allDisbursementOfFund
    }
    public async getDisbursementOfFundByPtk_id(ptk_id: string): Promise<Array<DisbursementOfFundAttributes>> {
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { ptk_id: ptk_id }, include: { model: DetailOfActivity } })
        return allDisbursementOfFund
    }
    public async getDisbursementOfFundByStatus(status: number): Promise<Array<DisbursementOfFundAttributes>> {
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { status }, include: { model: DetailOfActivity } })
        return allDisbursementOfFund
    }
    public async getDisbursementOfFundByWithDraw(withdraw: number): Promise<Array<DisbursementOfFundAttributes>> {
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { withdraw }, include: { model: DetailOfActivity } })
        return allDisbursementOfFund
    }
    public async addDisbursementOfFund(activity: Array<{ activity_id: string, amount: number, accounting_year: string, month_index: number, sharing_program: boolean }>): Promise<Array<{ activity_id: string, remainingAmount: number }>> {
        let failedActivity: Array<{ activity_id: string, remainingAmount: number }> = []
        for (let i in activity) {
            const checkRemainingAmount_ = await detailOfActivities.checkRemainingAmount(activity[i].activity_id, activity[i].amount)
            if (checkRemainingAmount_.status) {
                await DisbursementOfFunds.create({
                    accounting_year: activity[i].accounting_year,
                    activity_id: activity[i].activity_id,
                    amount: activity[i].amount,
                    month_index: activity[i].month_index,
                    sharing_program: activity[i].sharing_program,
                    status: false,
                    withdraw: false,
                })
            } else if (checkRemainingAmount_.remainingAmount !== 0) {
                failedActivity.push({ activity_id: activity[i].activity_id, remainingAmount: checkRemainingAmount_.remainingAmount })
            } else {
                failedActivity.push({ activity_id: activity[i].activity_id, remainingAmount: 0 })
            }
        }
        if (failedActivity.length > 0) {
            return failedActivity
        }
        return []
    }
    public async approveStatusDisbursementOfFund(uuid: string): Promise<{status:boolean,message:string}> {
        const oneDisbursementOfFund = await this.getDisbursementOfFundByUuid(uuid)
        if (oneDisbursementOfFund) {
            const checkRemainingAmount_ = await detailOfActivities.checkRemainingAmount(oneDisbursementOfFund.activity_id, oneDisbursementOfFund.amount)
            if (!checkRemainingAmount_.status) {
                return {status:false,message:"amount out of range"}
            }
            !oneDisbursementOfFund?.status && await detailOfActivities.updateReceivedAmountDetailOfActivity(oneDisbursementOfFund.activity_id, oneDisbursementOfFund.amount)
            await DisbursementOfFunds.update({ status: true }, { where: { uuid } })
            if (oneDisbursementOfFund.sharing_program) {
                // TODO: add to sharing_program table
            }
            return {status:true,message:"update status succes"}
        }
        return {status:false,message:"disbursement of fund not found"}
    }
    public async approveWithDrawDisbursementOfFund(uuid: string, ptk_id: string | null, recipient: string | null): Promise<{status:boolean,message:string}> {
        const oneDisbursementOfFund = await this.getDisbursementOfFundByUuid(uuid)
        if (oneDisbursementOfFund && oneDisbursementOfFund.status) {
            await DisbursementOfFunds.update({ withdraw: true, ptk_id: ptk_id, recipient: recipient }, { where: { uuid } })
            return {status:true,message:"update withdraw succes"}
        }
        return {status:false,message:"cannot update withdraw because the status is still false"}
    }
}

export default new DisbursementOfFundLogic