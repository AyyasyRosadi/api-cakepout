import DetailOfActivity from "../service/apakah/detailOfActivities/model";


class DetailOfActivityHelper {
    public async getAmountDetailOfActivity(id: string): Promise<{ amount: number, receivedAmount: number } | null> {
        const oneDetailOfActivity = await DetailOfActivity.findOne({ where: { id } })
        if (!oneDetailOfActivity) {
            return null
        }
        return { amount: oneDetailOfActivity?.total, receivedAmount: oneDetailOfActivity?.total }
    }
    public async checkRemainingAmountDetailOfActivity(uuid: string, amount: number): Promise<{ status: boolean, remainingAmount: number }> {
        const oneActivity = await this.getAmountDetailOfActivity(uuid)
        // get amount & receivedAmount
        if (oneActivity && oneActivity.amount >= (oneActivity.receivedAmount + amount)) {
            return { status: true, remainingAmount: oneActivity.amount - (oneActivity.receivedAmount + amount) }
        } else if (oneActivity) {
            return { status: false, remainingAmount: oneActivity.amount - oneActivity.receivedAmount }
        }
        return { status: false, remainingAmount: 0 }
    }
    public async updateReceivedAmountDetailOfActivity(id: string, amount: number): Promise<boolean> {
        const oneDetailOfActivity = await this.getAmountDetailOfActivity(id)
        if (oneDetailOfActivity) {
            const result = oneDetailOfActivity?.receivedAmount + amount
            await DetailOfActivity.update({ total: result }, { where: { id } })
            return true
        }
        return false
    }

}

export default new DetailOfActivityHelper