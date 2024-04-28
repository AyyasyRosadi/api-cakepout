import { Op } from "sequelize";
import DetailOfActivity from "../detailOfActivity/model";
import GroupAccount from "../groupAccount/model";
import { AccountPaginationAttributes, AccountAttributes } from "./dto";
import Account from "./model";
import { LogicBase, messageAttribute, defaultMessage } from '../logicBase';
import GroupAccountAttributes from "../groupAccount/dto";
import account from "../../helper/account";



class AccountLogic extends LogicBase {
    private include = [
        { model: DetailOfActivity, as: 'detail_of_activity' },
        { model: GroupAccount }
    ]
    public async getAllAccount(): Promise<messageAttribute<Array<AccountAttributes>>> {
        const allAccount = await Account.findAll({ include: this.include })
        return this.message<Array<AccountAttributes>>(200, allAccount)
    }
    public async getAllAccountByPage(page: number, size: number): Promise<messageAttribute<AccountPaginationAttributes>> {
        const offset = (page - 1) * size
        const allAccount = await Account.findAndCountAll({
            limit: size,
            offset: offset,
            include: this.include,
        })
        return this.message(200, {
            page,
            totalPages: Math.ceil(allAccount.count / size),
            totalItems: allAccount.count,
            data: allAccount.rows
        })
    }
    public async getAccountByUuid(uuid: string): Promise<messageAttribute<AccountAttributes | defaultMessage>> {
        const oneAccount = await Account.findOne({ where: { uuid }, include: this.include })
        if (!oneAccount) {
            return this.message(404, { message: "not found" })
        }
        return this.message(200, oneAccount)
    }
    public async getAccountByActivity(activity_id: string): Promise<messageAttribute<Array<AccountAttributes>>> {
        const allAccount = await Account.findAll({ where: { activity_id }, include: this.include })
        return this.message(200, allAccount)
    }
    public async getAccountByGroupAccount(group_account: number | string): Promise<messageAttribute<Array<AccountAttributes>>> {
        const queryGroupAccount = group_account === "-" ? { group_account: 0 } : parseInt(group_account as string) === 4 ? { [Op.not]: { group_account } } : { group_account }
        const allAccount = await Account.findAll({
            include: [
                { model: DetailOfActivity, as: 'detail_of_activity' },
                { model: GroupAccount, where: queryGroupAccount }
            ]
        })
        return this.message(200, allAccount)
    }
    public async getAccountByAccountNumber(account_number: string): Promise<messageAttribute<AccountAttributes | null>> {
        const oneAccount = await Account.findOne({ where: { account_number }, include: this.include })
        return this.message(200, oneAccount)
    }
    public async addAccount(name: string, group_account: number, group_account_label: number, activity_id: string | null, group_account_name: string): Promise<messageAttribute<defaultMessage>> {
        try {
            await account.generateAccount(name,group_account,group_account_label,activity_id,group_account_name)
            return this.message(200, { message: "Succes" })
        } catch (_) {
            return this.message(403, { message: "Gagal" })
        }
    }
    public async updateAccount(uuid: string, name: string): Promise<messageAttribute<defaultMessage>> {
        try {
            await Account.update({ name }, { where: { uuid } })
            return this.message(200, { message: "Succes" })
        } catch {
            return this.message(403, { message: "Gagal" })
        }
    }
    public async deleteAccount(uuid: string): Promise<messageAttribute<defaultMessage>> {
        try {
            await Account.destroy({ where: { uuid } })
            return this.message(200, { message: "Succes" })
        } catch {
            return this.message(403, { message: "Gagal" })
        }
    }
}

export default new AccountLogic;