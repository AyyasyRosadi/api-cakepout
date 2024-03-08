import { Request, Response } from "express";
import BaseRouter from "../../router/base";
import logic from "./logic";
import validaor from "./validaor";

class AccountRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            async (req: Request, res: Response): Promise<Response> => {
                const allAccount = await logic.getAllAccount()
                return res.status(200).json(allAccount)
            }
        )
        this.router.get('/:uuid',
            async (req: Request, res: Response): Promise<Response> => {
                const oneAccount = await logic.getAccountByUuid(req.params?.uuid)
                if (!oneAccount) {
                    return res.status(404).json({ msg: 'account not found' })
                }
                return res.status(200).json(oneAccount)
            }
        )
        this.router.get('/activity/:activity_id',
            async (req: Request, res: Response): Promise<Response> => {
                const allAccount = await logic.getAccountByActivity(req.params?.activity_id)
                return res.status(200).json(allAccount)
            }
        )
        this.router.get('/group_account/:group_account',
            async (req: Request, res: Response): Promise<Response> => {
                const oneAccount = await logic.getAccountByGroupAccount(parseInt(req.params?.group_account))
                if (!oneAccount) {
                    return res.status(404).json({ msg: 'account not found' })
                }
                return res.status(200).json(oneAccount)
            }
        )
        this.router.get('/account_number/:account_number',
            async (req: Request, res: Response): Promise<Response> => {
                const oneAccount = await logic.getAccountByAccountNumber(req.params?.account_number)
                if (!oneAccount) {
                    return res.status(404).json({ msg: 'account not found' })
                }
                return res.status(200).json(oneAccount)
            }
        )
        this.router.post('/',
            validaor.type(),
            async (req: Request, res: Response): Promise<Response> => {
                const { name, group_account, group_account_label, account_number, activity_id } = req.body
                const addAccount = await logic.addAccount(name, group_account, group_account_label, account_number, activity_id)
                if (!addAccount.status) {
                    return res.status(400).json({ msg: addAccount.message })
                }
                return res.status(200).json({ msg: addAccount.message })
            }
        )
        this.router.put('/:uuid',
            validaor.type(),
            async (req: Request, res: Response): Promise<Response> => {
                const { name, group_account, group_account_label, account_number, activity_id } = req.body
                const updateAccount = await logic.updateAccount(req.params?.uuid, name, group_account, group_account_label, account_number, activity_id)
                if (!updateAccount.status) {
                    return res.status(400).json({ msg: updateAccount.message })
                }
                return res.status(200).json({ msg: updateAccount.message })
            }
        )
        this.router.delete('/:uuid',
            async (req: Request, res: Response): Promise<Response> => {
                const deleteAccount = await logic.deleteAccount(req.params?.uuid)
                if (!deleteAccount.status) {
                    return res.status(400).json({ msg: deleteAccount.message })
                }
                return res.status(200).json({ msg: deleteAccount.message })
            }
        )
    }
}

export default new AccountRouter().router;
