import {Request, Response} from 'express';
import BaseRouter from '../../routerBase';
import logic from './logic';
import {queryToString} from '../../../helper/convertQuery'

class AccountAutomationRouter extends BaseRouter{
    routes(): void {
        this.router.post("/", async(req:Request, res:Response):Promise<Response>=>{
            const {uuid_account_from, uuid_account_to, role} = req.body;
            const save = await logic.create(uuid_account_from, uuid_account_to, role)
            return res.status(save.status).json(save.data)
        });

        this.router.get("/account", async(req:Request, res:Response):Promise<Response>=>{
            const {group_account} = req.query;
            const group_account_convert = queryToString(group_account)
            const getAccount = await logic.getAccount(group_account_convert!==""? parseInt(group_account_convert):0)
            return res.status(getAccount.status).json(getAccount.data)
        })

    }
}

export default new AccountAutomationRouter().router