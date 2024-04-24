import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";
import validaor from "./validaor";
import authentication from "../../middleware/authentication";
import { ALLROLE } from "../constant";

class AccountRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
        // authentication.authenticationUser(ALLROLE),
        async(req:Request,res:Response):Promise<Response>=>{
            const allAccount = await logic.getAllAccount()
            return res.status(allAccount.status).json(allAccount.data)
        })
        this.router.get('/page',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const { page, size } = req.query;
                const allAccount = await logic.getAllAccountByPage(Number(page), Number(size))
                return res.status(200).json(allAccount)
            }
        )
        this.router.get('/:uuid',
            authentication.authenticationUser(ALLROLE),

            async (req: Request, res: Response): Promise<Response> => {
                const oneAccount = await logic.getAccountByUuid(req.params?.uuid)
                if (!oneAccount) {
                    return res.status(404).json({ msg: 'account not found' })
                }
                return res.status(200).json(oneAccount)
            }
        )
        this.router.get('/activity/:activity_id',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allAccount = await logic.getAccountByActivity(req.params?.activity_id)
                return res.status(200).json(allAccount)
            }
        )
        this.router.get('/group-account/:group_account',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneAccount = await logic.getAccountByGroupAccount(parseInt(req.params?.group_account))
                if (!oneAccount) {
                    return res.status(404).json({ msg: 'account not found' })
                }
                return res.status(200).json(oneAccount)
            }
        )
        this.router.get('/account-number/:account_number',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneAccount = await logic.getAccountByAccountNumber(req.params?.account_number)
                if (!oneAccount) {
                    return res.status(404).json({ msg: 'account not found' })
                }
                return res.status(200).json(oneAccount)
            }
        )
        this.router.post('/',
            authentication.authenticationUser(ALLROLE),
            validaor.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const { name, group_account, group_account_label, activity_id, group_account_name } = req.body
                const addAccount = await logic.addAccount(name, group_account, group_account_label, activity_id, group_account_name)
                if (!addAccount.status) {
                    return res.status(400).json({ msg: addAccount.message })
                }
                return res.status(200).json({ msg: addAccount.message })
            }
        )
        this.router.put('/:uuid',
            authentication.authenticationUser(ALLROLE),
            validaor.update(),
            async (req: Request, res: Response): Promise<Response> => {
                const { name } = req.body
                const updateAccount = await logic.updateAccount(req.params?.uuid, name)
                if (!updateAccount.status) {
                    return res.status(400).json({ msg: updateAccount.message })
                }
                return res.status(200).json({ msg: updateAccount.message })
            }
        )
        this.router.delete('/:uuid',
            authentication.authenticationUser(ALLROLE),
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
