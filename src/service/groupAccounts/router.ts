import { Request, Response } from "express";
import BaseRouter from "../../router/base";
import logic from "./logic";


class GroupAccountRouter extends BaseRouter {
    routes(): void {
        this.router.get('/', async (req: Request, res: Response): Promise<Response> => {
            const allGroupAccount = await logic.getAllGroupAccount()
            return res.status(200).json(allGroupAccount)
        })
        this.router.post('/', async (req: Request, res: Response): Promise<Response> => {
            const allGroupAccount = await logic.getGroupAccountByGroup(parseInt(req.body.group_account))
            return res.status(200).json(allGroupAccount)
        })
        this.router.post('/', async (req: Request, res: Response): Promise<Response> => {
            const allGroupAccount = await logic.getGroupAccountByLabel(parseInt(req.body?.group_account), parseInt(req.body?.group_account_label))
            return res.status(200).json(allGroupAccount)
        })
    }
}

export default new GroupAccountRouter().router;