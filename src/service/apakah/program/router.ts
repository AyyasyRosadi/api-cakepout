import BaseRouter from "../../routerBase";
import { Request, Response } from "express";
import logic from "./logic";

class Program extends BaseRouter{
    routes(): void {
        this.router.post("/", async(req:Request, res:Response):Promise<Response>=>{
            const {institution, program_no, item, modifable} = req.body;
            const status = await logic.create(institution, program_no, item, modifable)
            return res.status(status.status).json(status.data)
        })
    }
}

export default  new Program().router;