import account from "../../helper/account";
import accountingYear from "../../helper/accountingYear";
import detailOfActivities from "../../helper/detailOfActivities";
import message from "../../helper/message";
import DetailOfActivity from "../detailOfActivity/model";
import { ActionAttributes } from "../interfaces";
import DisbursementOfFundAttributes from "./dto";
import DisbursementOfFunds from "./model";



class DisbursementOfFundLogic {
    public async getAllDisbursementOfFund(): Promise<Array<DisbursementOfFundAttributes>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { accounting_year: activeYear?.tahun }, include: { model: DetailOfActivity }, order: [["createdAt", "ASC"]] })
        return allDisbursementOfFund
    }
    public async getDisbursementOfFundByUuid(uuid: string): Promise<DisbursementOfFundAttributes | null> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const oneDisbursementOfFund = await DisbursementOfFunds.findOne({ where: { uuid, accounting_year: activeYear?.tahun }, include: { model: DetailOfActivity }, order: [["createdAt", "ASC"]] })
        return oneDisbursementOfFund
    }
    public async getDisbursementOfFundByActivityId(activity_id: string): Promise<Array<DisbursementOfFundAttributes>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { activity_id: activity_id, accounting_year: activeYear?.tahun }, include: { model: DetailOfActivity }, order: [["createdAt", "ASC"]] })
        return allDisbursementOfFund
    }
    public async getDisbursementOfFundByPtk_id(ptk_id: string): Promise<Array<DisbursementOfFundAttributes>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { ptk_id: ptk_id, accounting_year: activeYear?.tahun }, include: { model: DetailOfActivity }, order: [["createdAt", "ASC"]] })
        return allDisbursementOfFund
    }
    public async getDisbursementOfFundByStatus(status: number): Promise<Array<DisbursementOfFundAttributes>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { status, withdraw: false, accounting_year: activeYear?.tahun }, include: { model: DetailOfActivity }, order: [["createdAt", "ASC"]] })
        return allDisbursementOfFund
    }
    public async getDisbursementOfFundByWithDraw(withdraw: number): Promise<Array<DisbursementOfFundAttributes>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { withdraw, accounting_year: activeYear?.tahun }, include: { model: DetailOfActivity }, order: [["createdAt", "ASC"]] })
        return allDisbursementOfFund
    }
    public async addDisbursementOfFund(activity: Array<{ activity_id: string, amount: number, accounting_year: string, month_index: number, sharing_program: boolean }>): Promise<Array<{ activity_id: string, remainingAmount: number }>> {
        let failedActivity: Array<{ activity_id: string, remainingAmount: number }> = []
        for (let i in activity) {
            const checkRemainingAmount_ = await detailOfActivities.checkRemainingAmountDetailOfActivity(activity[i].activity_id, activity[i].amount)
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
    public async approveStatusDisbursementOfFund(uuid: string): Promise<ActionAttributes> {
        try {
            const oneDisbursementOfFund = await this.getDisbursementOfFundByUuid(uuid)
            if (oneDisbursementOfFund) {
                const checkRemainingAmount_ = await detailOfActivities.checkRemainingAmountDetailOfActivity(oneDisbursementOfFund.activity_id, oneDisbursementOfFund.amount)
                if (!checkRemainingAmount_.status) {
                    return { status: false, message: "amount out of range" }
                }
                !oneDisbursementOfFund?.status && await detailOfActivities.updateReceivedAmountDetailOfActivity(oneDisbursementOfFund.activity_id, oneDisbursementOfFund.amount)
                await DisbursementOfFunds.update({ status: true }, { where: { uuid } })
                if (oneDisbursementOfFund.sharing_program) {
                    // TODO: add to sharing_program table
                }
                return message.sendMessage(true,'Update status succes')
            }
            return message.sendMessage(false)
        } catch (_) {
            return message.sendMessage(false)
        }
    }
    public async approveWithDrawDisbursementOfFund(uuid: string, ptk_id: string | null, recipient: string | null): Promise<ActionAttributes> {
        try {
            const oneDisbursementOfFund = await this.getDisbursementOfFundByUuid(uuid)
            const oneAccount = await account.getAccountByActivityId(oneDisbursementOfFund?.activity_id!)
            if (oneDisbursementOfFund!.status && oneAccount) {
                await DisbursementOfFunds.update({ withdraw: true, ptk_id: ptk_id, recipient: recipient }, { where: { uuid } })
                return message.sendMessage(true, "update withdraw succes")
            }
            return message.sendMessage(false,'Account not found')
        } catch (_) {
            return message.sendMessage(false)
        }
    }
    public async deleteDisbursementOfFund(uuid: string): Promise<ActionAttributes> {
        try {
            await DisbursementOfFunds.destroy({ where: { uuid } })
            return message.sendMessage(true)
        } catch (_) {
            return message.sendMessage(false)
        }
    }
}

export default new DisbursementOfFundLogic