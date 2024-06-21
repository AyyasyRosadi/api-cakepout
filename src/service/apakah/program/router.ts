import BaseRouter from "../../routerBase";
import { Request, Response } from "express";
import logic from "./logic";

class Program extends BaseRouter{
    routes(): void {
        this.router.post("/", async(req:Request, res:Response):Promise<Response>=>{
            const {institution_id, item} = req.body;
            const status = await logic.create(institution_id, item)
            return res.status(status.status).json(status.data)
        });
        this.router.get("/:institutionId", async(req:Request, res:Response):Promise<Response>=>{
            const {institutionId} = req.params
            const status = await logic.getProgramByInstitution(parseInt(institutionId))
            return res.status(status.status).json(status.data)
        });
    }

}

export default  new Program().router;