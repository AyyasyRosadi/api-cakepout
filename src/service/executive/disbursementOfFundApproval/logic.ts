import disbursementOfFund from "../../../helper/disbursementOfFund";
import Activity from "../../apakah/activity/model";
import DetailOfActivity from "../../apakah/detailOfActivities/model";
import DisbursementOfFundAttributes from "../../cakepout/disbursementOfFund/dto";
import DisbursementOfFunds from "../../cakepout/disbursementOfFund/model";
import { defaultMessage, LogicBase, messageAttribute } from "../../logicBase";


class DisbursementOfFundApprovalLogic extends LogicBase {
    public async getDisbursementOfFund(institution_no: number): Promise<messageAttribute<DisbursementOfFundAttributes[]>> {
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { status: 0 }, include: [{ model: DetailOfActivity, required: true, include: [{ model: Activity, where: { institution_no }, required: true, attributes: ['institution_no'] }] }] })
        return this.message(200, await disbursementOfFund.groupingDisbursementOfFund(allDisbursementOfFund.map((e) => e.get({ plain: true }))))
    }

    public async approveByExecutive(queue: Array<string>): Promise<messageAttribute<defaultMessage>> {
        try {
            for (let i in queue) {
                const groups = await disbursementOfFund.getDisbursementOfFundBySharingProgram(queue[i], 0)
                if (groups.length > 0) {
                    for (let j in groups) {
                        await disbursementOfFund.updateStatusDsibursementOfFund(groups[j]?.uuid, 1)
                    }
                } else {
                    const oneDisbursementOfFund = await disbursementOfFund.getDisbursementOfFundByUuid(queue[i])
                    await disbursementOfFund.updateStatusDsibursementOfFund(oneDisbursementOfFund?.uuid, 1)
                }
            }
            return this.message(200, { message: "Succes" })
        } catch (_) {
            return this.message(403, { message: "Gagal" })
        }
    }
}

export default new DisbursementOfFundApprovalLogic