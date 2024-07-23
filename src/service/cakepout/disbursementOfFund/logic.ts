import { Includeable, Order } from "sequelize";
import DetailOfActivity from "../../apakah/detailOfActivities/model";
import { LogicBase, defaultMessage, messageAttribute } from "../../logicBase";
import DisbursementOfFundAttributes, { AddDisbursementOfFund, PaginationGroupingDisbursementOfFund } from "./dto";
import DisbursementOfFunds from "./model";
import SharingProgram from "../../apakah/sharingProgram/model";
import disbursementOfFund from "../../../helper/disbursementOfFund";
import yearActiveInSystem from "../../../helper/yearActiveInSystem";
import realization from "../../../helper/realization";
import Activity from "../../apakah/activity/model";



class DisbursementOfFundLogic extends LogicBase {
    private inlcude: Includeable[] = [{ model: DetailOfActivity, include: [{ model: Activity,attributes:['institution_no'] }] }, { model: SharingProgram, as: "sharing_programs" }]
    private order: Order = [['sharing_program', 'DESC'], ["createdAt", "ASC"]]

    public async getAllDisbursementOfFund(): Promise<messageAttribute<Array<DisbursementOfFundAttributes>>> {
        const activeYear = await yearActiveInSystem.getYear('cakepout')
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { accounting_year: activeYear }, include: this.inlcude, order: this.order })
        return this.message(200, allDisbursementOfFund)
    }
    public async getDisbursementOfFundByUuid(uuid: string): Promise<messageAttribute<DisbursementOfFundAttributes | defaultMessage>> {
        const oneDisbursementOfFund = await disbursementOfFund.getDisbursementOfFundByUuid(uuid)
        return this.message(oneDisbursementOfFund ? 200 : 404, oneDisbursementOfFund ? oneDisbursementOfFund : { message: "Antrian tidak ditemukan" })
    }
    public async getDisbursementOfFundByDetailActivity(detail_of_activity_id: string): Promise<messageAttribute<Array<DisbursementOfFundAttributes>>> {
        const activeYear = await yearActiveInSystem.getYear('cakepout')
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { detail_of_activity_id, accounting_year: activeYear }, include: this.inlcude, order: this.order })
        return this.message(200, allDisbursementOfFund)
    }
    public async getDisbursementOfFundByPtkId(ptk_id: string): Promise<messageAttribute<Array<DisbursementOfFundAttributes>>> {
        const activeYear = await yearActiveInSystem.getYear('cakepout')
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { ptk_id: ptk_id, accounting_year: activeYear }, include: this.inlcude, order: this.order })
        return this.message(200, allDisbursementOfFund)
    }

    public async getDisbursementOfFundByStatus(status: number, page: number, size: number): Promise<messageAttribute<PaginationGroupingDisbursementOfFund>> {
        const activeYear = await yearActiveInSystem.getYear('cakepout')
        const offset = (page - 1) * size
        const allDisbursementOfFund = await DisbursementOfFunds.findAndCountAll({
            limit: size,
            offset: offset,
            where: { status, withdraw: false, accounting_year: activeYear },
            include: this.inlcude,
            order: this.order,
        })
        const structure = await disbursementOfFund.groupingDisbursementOfFund(allDisbursementOfFund.rows)
        return this.message(200, {
            page,
            totalPages: Math.ceil(allDisbursementOfFund.count / size),
            totalItems: allDisbursementOfFund.count,
            data: structure
        })
    }

    public async getDisbursementOfFundByWithDraw(withdraw: number): Promise<messageAttribute<Array<DisbursementOfFundAttributes>>> {
        const activeYear = await yearActiveInSystem.getYear('cakepout')
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { withdraw, accounting_year: activeYear }, include: this.inlcude, order: this.order })
        return this.message(200, allDisbursementOfFund)
    }

    public async approveByFinance(queue: Array<string>): Promise<messageAttribute<defaultMessage>> {
        try {
            for (let id of queue) {
                const groups = await disbursementOfFund.getDisbursementOfFundBySharingProgram(id, 1)
                if (groups.length > 0) {
                    for (let data of groups) {
                        realization.updateAmountRealization(data?.detail_of_activity_id, data?.amount)
                        await DisbursementOfFunds.update({ status: 2 }, { where: { uuid: data?.uuid } })
                    }
                } else {
                    const oneDisbursementOfFund = await disbursementOfFund.getDisbursementOfFundByUuid(id)
                    realization.updateAmountRealization(oneDisbursementOfFund!.detail_of_activity_id, oneDisbursementOfFund!.amount)
                    await DisbursementOfFunds.update({ status: 2 }, { where: { uuid: oneDisbursementOfFund!.uuid } })
                }
            }
            return this.message(200, { message: "Succes" })
        } catch (_) {
            return this.message(403, { message: "Gagal" })
        }
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