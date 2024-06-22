import BaseRouter from "../../routerBase";
import logic from "./logic";
import { Request, Response } from "express";

class SubActivityRouter extends BaseRouter{
    routes(): void {
        this.router.post("/", async(req:Request, res:Response):Promise<Response>=>{
            const {activity_id, name} = req.body;
            const status = await logic.create(activity_id, name)
            return res.status(status.status).json(status.data)
        });
        
    }

}

export default new SubActivityRouter().router;