import { Includeable, Order } from "sequelize";
import account from "../../helper/account";
import accountingYear from "../../helper/accountingYear";
import detailOfActivities from "../../helper/detailOfActivities";
import DetailOfActivity from "../detailOfActivity/model";
import { LogicBase, defaultMessage, messageAttribute } from "../logicBase";
import DisbursementOfFundAttributes from "./dto";
import DisbursementOfFunds from "./model";



class DisbursementOfFundLogic extends LogicBase {
    private inlcude: Includeable = { model: DetailOfActivity }
    private order: Order = [["createdAt", "ASC"]]

    public async getAllDisbursementOfFund(): Promise<messageAttribute<Array<DisbursementOfFundAttributes>>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { accounting_year: activeYear?.tahun }, include: this.inlcude, order: this.order })
        return this.message(200, allDisbursementOfFund)
    }
    public async getDisbursementOfFundByUuid(uuid: string): Promise<messageAttribute<DisbursementOfFundAttributes | defaultMessage>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const oneDisbursementOfFund = await DisbursementOfFunds.findOne({ where: { uuid, accounting_year: activeYear?.tahun }, include: this.inlcude, order: this.order })
        return this.message(oneDisbursementOfFund ? 200 : 404, oneDisbursementOfFund ? oneDisbursementOfFund : { message: "Antrian tidak ditemukan" })
    }
    public async getDisbursementOfFundByActivityId(activity_id: string): Promise<messageAttribute<Array<DisbursementOfFundAttributes>>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { activity_id: activity_id, accounting_year: activeYear?.tahun }, include: this.inlcude, order: this.order })
        return this.message(200, allDisbursementOfFund)
    }
    public async getDisbursementOfFundByPtk_id(ptk_id: string): Promise<messageAttribute<Array<DisbursementOfFundAttributes>>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { ptk_id: ptk_id, accounting_year: activeYear?.tahun }, include: this.inlcude, order: this.order })
        return this.message(200, allDisbursementOfFund)
    }
    public async getDisbursementOfFundByStatus(status: number): Promise<messageAttribute<Array<DisbursementOfFundAttributes>>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { status, withdraw: false, accounting_year: activeYear?.tahun }, include: this.inlcude, order: this.order })
        return this.message(200, allDisbursementOfFund)
    }
    public async getDisbursementOfFundByWithDraw(withdraw: number): Promise<messageAttribute<Array<DisbursementOfFundAttributes>>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { withdraw, accounting_year: activeYear?.tahun }, include: this.inlcude, order: this.order })
        return this.message(200, allDisbursementOfFund)
    }
    public async addDisbursementOfFund(activity: Array<{ activity_id: string, amount: number, accounting_year: string, month_index: number, sharing_program: boolean }>): Promise<messageAttribute<Array<{ activity_id: string, remainingAmount: number }> | defaultMessage>> {
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
            return this.message(200, failedActivity)
        }
        return this.message(200, { message: "Succes" })
    }
    public async approveStatusDisbursementOfFund(uuid: string): Promise<messageAttribute<defaultMessage>> {
        try {
            const oneDisbursementOfFund = await this.getDisbursementOfFundByUuid(uuid)
            if (oneDisbursementOfFund.status !== 200 ) {
                return this.message(403,{message:"Gagal"})
            }
            const disbursementOfFund = oneDisbursementOfFund.data as DisbursementOfFundAttributes
            const checkRemainingAmount_ = await detailOfActivities.checkRemainingAmountDetailOfActivity(disbursementOfFund.activity_id, disbursementOfFund.amount)
            if (!checkRemainingAmount_.status) {
                return this.message(403,{message:"Status tidak disetujui"})
            }
            !disbursementOfFund?.status && await detailOfActivities.updateReceivedAmountDetailOfActivity(disbursementOfFund.activity_id, disbursementOfFund.amount)
            await DisbursementOfFunds.update({ status: true }, { where: { uuid } })
            if (disbursementOfFund.sharing_program) {
                // TODO: add to sharing_program table
            }
            return this.message(200,{message:"Succes"})
        } catch (_) {
            return this.message(403,{message:"Gagal"})
        }
    }
    public async approveWithDrawDisbursementOfFund(uuid: string, ptk_id: string | null, recipient: string | null): Promise<messageAttribute<defaultMessage>> {
        try {
            const oneDisbursementOfFund = await this.getDisbursementOfFundByUuid(uuid)
            const disbursementOfFund = oneDisbursementOfFund.data as DisbursementOfFundAttributes
            const oneAccount = await account.getAccountByActivityId(disbursementOfFund.activity_id!)
            if (oneDisbursementOfFund.status !== 200 || !oneAccount) {
                return this.message(404,{message:"Antrian/Akun tidak ditemukan"})
            }
            await DisbursementOfFunds.update({ withdraw: true, ptk_id: ptk_id, recipient: recipient }, { where: { uuid } })
            return this.message(200,{message:"Succes"})
        } catch (_) {
            return this.message(403,{message:"Gagal"})
        }
    }
    public async deleteDisbursementOfFund(uuid: string): Promise<messageAttribute<defaultMessage>> {
        try {
            await DisbursementOfFunds.destroy({ where: { uuid } })
            return this.message(200,{message:"Succes"})
        } catch (_) {
            return this.message(403,{message:"Gagal"})
        }
    }
}

export default new DisbursementOfFundLogic