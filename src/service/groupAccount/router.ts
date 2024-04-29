import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";
import authentication from "../../middleware/authentication";
import { ALLROLE, SYSTEMCAKEPOUT } from "../constant";


class GroupAccountRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
        authentication.authenticationUser(SYSTEMCAKEPOUT,ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allGroupAccount = await logic.getAllGroupAccount()
                return res.status(allGroupAccount.status).json(allGroupAccount.data)
            })
        this.router.post('/',
        authentication.authenticationUser(SYSTEMCAKEPOUT,ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allGroupAccount = await logic.getGroupAccountByGroup(parseInt(req.body.group_account))
                return res.status(allGroupAccount.status).json(allGroupAccount.data)
            })
        this.router.post('/',
        authentication.authenticationUser(SYSTEMCAKEPOUT,ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allGroupAccount = await logic.getGroupAccountByLabel(parseInt(req.body?.group_account), parseInt(req.body?.group_account_label))
                return res.status(allGroupAccount.status).json(allGroupAccount.data)
            })
    }
}

export default new GroupAccountRouter().router;