import Realization from "../service/apakah/realization/model"


class RealizationHelper {
    public async checkAmountRealizations(detail_of_activity_id: string, amount: number): Promise<boolean> {
        const oneRealization = await Realization.findOne({ where: { detail_of_activity_id } })
        if (oneRealization!.total_realization + amount <= oneRealization!.total_budget) {
            return true
        }
        return false
    }

    public async updateAmountRealization(detail_of_activity_id: string, amount: number): Promise<void> {
        const realization = await Realization.findOne({ where: { detail_of_activity_id } })
        await realization!.increment("total_realization", { by: amount })
    }
}

export default new RealizationHelper