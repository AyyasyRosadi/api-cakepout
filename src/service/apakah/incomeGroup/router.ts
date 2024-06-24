import BaseRouter from "../../routerBase";
import logic from "./logic";
import { Request, Response } from "express";



class IncomeGroupRouter extends BaseRouter {
    routes(): void {
        this.router.post("/", async (req: Request, res: Response): Promise<Response> =>{
            const {name, parent_id} = req.body
            const status = await logic.create(name, parseInt(parent_id));
            return res.status(status.status).json(status.data)
        })
        this.router.get("/", async(req:Request, res:Response): Promise<Response> =>{
            const status = await logic.get();
            return res.status(status.status).json(status.data)
        })
    }
}

export default new IncomeGroupRouter().router