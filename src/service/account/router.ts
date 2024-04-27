import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";
import validaor from "./validaor";
import authentication from "../../middleware/authentication";
import { ALLROLE } from "../constant";

class AccountRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
        authentication.authenticationUser(ALLROLE),
        async(req:Request,res:Response):Promise<Response>=>{
            const allAccount = await logic.getAllAccount()
            return res.status(allAccount.status).json(allAccount.data)
        })
        this.router.get('/page',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const { page, size } = req.query;
                const allAccount = await logic.getAllAccountByPage(Number(page), Number(size))
                return res.status(allAccount.status).json(allAccount.data)
            }
        )
        this.router.get('/:uuid',
            authentication.authenticationUser(ALLROLE),

            async (req: Request, res: Response): Promise<Response> => {
                const oneAccount = await logic.getAccountByUuid(req.params?.uuid)
                return res.status(oneAccount.status).json(oneAccount.data)
            }
        )
        this.router.get('/activity/:activity_id',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allAccount = await logic.getAccountByActivity(req.params?.activity_id)
                return res.status(allAccount.status).json(allAccount.data)
            }
        )
        this.router.get('/group-account/:group_account',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneAccount = await logic.getAccountByGroupAccount(req.params?.group_account)
                return res.status(oneAccount.status).json(oneAccount.data)
            }
        )
        this.router.get('/account-number/:account_number',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneAccount = await logic.getAccountByAccountNumber(req.params?.account_number)
                return res.status(oneAccount.status).json(oneAccount.data)
            }
        )
        this.router.post('/',
            authentication.authenticationUser(ALLROLE),
            validaor.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const { name, group_account, group_account_label, activity_id, group_account_name } = req.body
                const addAccount = await logic.addAccount(name, group_account, group_account_label, activity_id, group_account_name)
                return res.status(addAccount.status).json(addAccount.data)
            }
        )
        this.router.put('/:uuid',
            authentication.authenticationUser(ALLROLE),
            validaor.update(),
            async (req: Request, res: Response): Promise<Response> => {
                const { name } = req.body
                const updateAccount = await logic.updateAccount(req.params?.uuid, name)
                return res.status(updateAccount.status).json({ msg: updateAccount.data })
            }
        )
        this.router.delete('/:uuid',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const deleteAccount = await logic.deleteAccount(req.params?.uuid)
                return res.status(deleteAccount.status).json({ msg: deleteAccount.data })
            }
        )
    }
}

export default new AccountRouter().router;
