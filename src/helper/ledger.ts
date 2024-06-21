import { Op } from "sequelize";
import Account from "../service/cakepout/account/model";
import GroupAccountAttributes from "../service/cakepout/groupAccount/dto";
import GroupAccount from "../service/cakepout/groupAccount/model";
import { LedgerAttributes } from "../service/cakepout/ledger/dto";
import Ledger from "../service/cakepout/ledger/model";


class LedgerHelper {
    public async getAllLedgerByOpenClosed(accounting_year: string, month_index: number[], account_id: string): Promise<LedgerAttributes[]> {
        const allLedger = await Ledger.findAll({
            where: {
                accounting_year,
                account_id,
                month_index: { [Op.in]: month_index },
                open: false
            }
        })
        return allLedger!
    }
    public async getOneLedger(month_index: number, accounting_year: string, account_id: string): Promise<LedgerAttributes> {
        const oneLadger = await Ledger.findOne({ where: { month_index, accounting_year, account_id } })
        return oneLadger!
    }
    public async getActiveLedgerByAccount(month_index: number, accounting_year: string, account_id: string): Promise<LedgerAttributes> {
        const oneLadger = await Ledger.findOne({ where: { month_index, account_id, accounting_year, open: 1 } })
        return oneLadger!
    }
    public async createLedger(accounting_year: string, account_id: string, month_index: number, open: boolean, total: number): Promise<boolean> {
        try {
            await Ledger.create({
                accounting_year,
                account_id,
                month_index,
                open,
                total
            })
            return true
        } catch {
            return false
        }
    }
    public async updateTotalLedger(total: number, uuid: string): Promise<boolean> {
        try {
            await Ledger.update({ total }, { where: { uuid } })
            return true
        } catch {
            return false
        }
    }
    public async generateLedger(accounting_year: string, account_id: string, month_index: number, total: number): Promise<LedgerAttributes | null> {
        let oneLadger = await this.getOneLedger(month_index, accounting_year, account_id)
        if (!oneLadger) {
            await this.createLedger(accounting_year, account_id, month_index, true, total)
        } else if (!oneLadger?.open) {
            return null
        } else {
            await this.updateTotalLedger(total + oneLadger?.total, oneLadger?.uuid)
        }
        return await this.getOneLedger(month_index, accounting_year, account_id)
    }
    public async getLedgerByGroupAndMonthIndex(group_account: number, month_index: number, asset: boolean, open: boolean): Promise<GroupAccountAttributes[]> {
        const allLedger = await GroupAccount.findAll({
            where: {
                group_account
            },
            order: [
                [{ model: Account, as: 'account' }, 'account_number', 'asc']
            ],
            include: [
                {
                    model: Account,
                    as: 'account',
                    where: {
                        asset
                    },
                    include: [
                        {
                            model: Ledger,
                            where: {
                                month_index,
                                open
                            }
                        }
                    ]
                }
            ]
        })
        return allLedger
    }
}

export default new LedgerHelper;