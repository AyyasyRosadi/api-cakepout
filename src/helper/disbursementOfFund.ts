import DetailOfActivity from "../service/apakah/detailOfActivities/model"
import DisbursementOfFundAttributes from "../service/cakepout/disbursementOfFund/dto"
import DisbursementOfFunds from "../service/cakepout/disbursementOfFund/model"

class DisbursementOfFundHelper {
    private include = [{ model: DetailOfActivity }]
    public async getDisbursementOfFundByGroupId(uuid: string,status:boolean): Promise<Array<DisbursementOfFundAttributes>> {
        const allDisbursementOfFund = await DisbursementOfFunds.findAll({ where: { sharing_program_id: uuid,status:status, withdraw: false }, include: this.include })
        return allDisbursementOfFund
    }
    public async getDisbursementOfFundByUuid(uuid: string): Promise<DisbursementOfFundAttributes> {
        const oneDisbursementOfFund = await DisbursementOfFunds.findOne({ where: { uuid: uuid }, include: this.include })
        return oneDisbursementOfFund!
    }

}

export default new DisbursementOfFundHelper