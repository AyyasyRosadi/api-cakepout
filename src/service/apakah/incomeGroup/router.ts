import authentication from "../../../middleware/authentication";
import { ALLROLEAPAKAH, SYSTEMAPAKAH } from "../../constant";
import BaseRouter from "../../routerBase";
import logic from "./logic";
import { Request, Response } from "express";
import validaor from "./validator";



class IncomeGroupRouter extends BaseRouter {
    routes(): void {
        this.router.post("/", 
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            validaor.create(),
            async (req: Request, res: Response): Promise<Response> =>{
            const {name, parent_id} = req.body
            const status = await logic.create(name, parseInt(parent_id));
            return res.status(status.status).json(status.data)
        })
        this.router.get("/", 
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async(req:Request, res:Response): Promise<Response> =>{
            const status = await logic.get();
            return res.status(status.status).json(status.data)
        })
    }
}

export default new IncomeGroupRouter().router