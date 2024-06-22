import BaseRouter from "../../routerBase";
import logic from "./logic";
import { Request, Response } from "express";

class Unit extends BaseRouter{
    routes(): void{
        this.router.get("/", async(req:Request, res:Response):Promise<Response>=>{
            const status = await logic.getAll()
            return res.status(status.status).json(status.data)
        })
    }
}

export default new Unit().router;