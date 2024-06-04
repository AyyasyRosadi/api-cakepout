import { Includeable, Order } from "sequelize";
import accountingYear from "../../helper/accountingYear";
import detailOfActivities from "../../helper/detailOfActivities";
import DetailOfActivity from "../detailOfActivity/model";
import { LogicBase, defaultMessage, messageAttribute } from "../logicBase";
import DisbursementOfFundAttributes, { GroupingDisbursementOfFund, PaginationGroupingDisbursementOfFund } from "./dto";
import DisbursementOfFunds from "./model";
import Account from "../account/model";
import { AccountAttributes } from "../account/dto";
import SharingProgram from "../sharingProgram/model";
import disbursementOfFund from "../../helper/disbursementOfFund";



class DisbursementOfFundLogic extends LogicBase {
    private inlcude: Includeable[] = [{ model: DetailOfActivity }, { model: SharingProgram, as: "sharing_programs" }]
    private order: Order = [['sharing_program', 'DESC'], ["createdAt", "ASC"]]

    private async getOneDisbursementOfFundByUuid(uuid: string): Promise<DisbursementOfFundAttributes | null> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const oneDisbursementOfFund = await DisbursementOfFunds.findOne({ where: { uuid, accounting_year: activeYear?.tahun }, include: this.inlcude, order: this.order })
        return oneDisbursementOfFund
    }
    public async getAllDisbursementOfFund(): Promise<messageAttribute<Array<DisbursementOfFundAttributes>>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { accounting_year: activeYear?.tahun }, include: this.inlcude, order: this.order })
        return this.message(200, allDisbursementOfFund)
    }
    public async getDisbursementOfFundByUuid(uuid: string): Promise<messageAttribute<DisbursementOfFundAttributes | defaultMessage>> {
        const oneDisbursementOfFund = await this.getOneDisbursementOfFundByUuid(uuid)
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
    private async groupingDisbursementOfFund(data: Array<DisbursementOfFundAttributes>): Promise<Array<any>> {
        let result: Array<GroupingDisbursementOfFund> = []
        for (let i in data) {
            if (data[i].sharing_program_id) {
                const find = result.find((value) => value.sharing_program_id === data[i].sharing_program_id)
                if (find) {
                    find.amount += data[i].amount
                    find.no_kegiatan += `/${data[i].rincian_kegiatan?.no_kegiatan}`
                    find.activity?.push(data[i])
                } else {
                    result.push({ accounting_year: data[i].accounting_year, amount: data[i].amount, ptk_id: data[i].ptk_id, receipient: data[i].recipient, reference_of_journal: data[i].reference_of_jurnal, sharing_program_id: data[i].sharing_program_id, sharing_program_name: data[i].sharing_programs!.name, status: data[i].status, withdraw: data[i].withdraw, uuid: data[i].uuid, uraian: data[i].rincian_kegiatan!.uraian, no_kegiatan: data[i].rincian_kegiatan!.no_kegiatan, activity: [data[i]] })
                }
            } else {
                result.push({ accounting_year: data[i].accounting_year, amount: data[i].amount, ptk_id: data[i].ptk_id, receipient: data[i].recipient, reference_of_journal: data[i].reference_of_jurnal, sharing_program_id: null, sharing_program_name: null, status: data[i].status, withdraw: data[i].withdraw, uuid: data[i].uuid, uraian: data[i].rincian_kegiatan!.uraian, no_kegiatan: data[i].rincian_kegiatan!.no_kegiatan })
            }
        }
        return result
    }
    public async getDisbursementOfFundByStatus(status: number, page: number, size: number): Promise<messageAttribute<PaginationGroupingDisbursementOfFund>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const offset = (page - 1) * size
        const allDisbursementOfFund = await DisbursementOfFunds.findAndCountAll({
            limit: size,
            offset: offset,
            where: { status, withdraw: false, accounting_year: activeYear?.tahun },
            include: this.inlcude,
            order: this.order,
        })
        const structure = await this.groupingDisbursementOfFund(allDisbursementOfFund.rows)
        return this.message(200, {
            page,
            totalPages: Math.ceil(allDisbursementOfFund.count / size),
            totalItems: allDisbursementOfFund.count,
            data: structure
        })
    }
    public async getDisbursementOfFundByWithDraw(withdraw: number): Promise<messageAttribute<Array<DisbursementOfFundAttributes>>> {
        const activeYear = await accountingYear.getActiveAccountingYear()
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { withdraw, accounting_year: activeYear?.tahun }, include: this.inlcude, order: this.order })
        return this.message(200, allDisbursementOfFund)
    }
    public async addDisbursementOfFund(activity: Array<{ activity_id: string, amount: number, accounting_year: string, month_index: number, sharing_program: boolean }>, sharing_program_id: string): Promise<messageAttribute<Array<{ activity_id: string, remainingAmount: number }> | defaultMessage>> {
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
                    sharing_program_id: activity[i].sharing_program ? sharing_program_id : null
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
    public async approveStatusDisbursementOfFund(antrian: Array<string>): Promise<messageAttribute<defaultMessage>> {
        try {
            for (let i in antrian) {
                const checkGroup = await disbursementOfFund.getDisbursementOfFundByGroupId(antrian[i],false)
                if (checkGroup.length > 0) {
                    for (let j in checkGroup) {
                        const checkRemainingAmount = await detailOfActivities.checkRemainingAmountDetailOfActivity(checkGroup[j].activity_id, checkGroup[j].amount)
                        if (checkRemainingAmount.status && !checkGroup[j].status) {
                            detailOfActivities.updateReceivedAmountDetailOfActivity(checkGroup[j].activity_id, checkGroup[j].amount)
                            await DisbursementOfFunds.update({ status: true }, { where: { uuid: checkGroup[j].uuid } })
                        }
                    }
                } else {
                    const oneDisbursementOfFund = await this.getOneDisbursementOfFundByUuid(antrian[i])
                    const checkRemainingAmount = await detailOfActivities.checkRemainingAmountDetailOfActivity(oneDisbursementOfFund!.activity_id, oneDisbursementOfFund!.amount)
                    if (!oneDisbursementOfFund?.status && checkRemainingAmount.status) {
                        detailOfActivities.updateReceivedAmountDetailOfActivity(oneDisbursementOfFund!.activity_id, oneDisbursementOfFund!.amount)
                        await DisbursementOfFunds.update({ status: true }, { where: { uuid: oneDisbursementOfFund!.uuid } })
                    }
                }
            }
            return this.message(200, { message: "Succes" })
        } catch (_) {
            return this.message(403, { message: "Gagal" })
        }
    }
    private async getAccountByActivityId(activity_id: string): Promise<AccountAttributes | null> {
        const oneAccount = await Account.findOne({ where: { activity_id } })
        return oneAccount
    }
    public async deleteDisbursementOfFund(uuid: string): Promise<messageAttribute<defaultMessage>> {
        try {
            await DisbursementOfFunds.destroy({ where: { uuid } })
            return this.message(200, { message: "Succes" })
        } catch (_) {
            return this.message(403, { message: "Gagal" })
        }
    }
}

export default new DisbursementOfFundLogic