import BaseRouter from "../../routerBase"
import logic from "./logic";
import { Request, Response } from "express";

class ActivityRouter extends BaseRouter{
    routes(): void {
        this.router.post("/", async(req:Request, res:Response):Promise<Response>=>{
            const {component_id, name, continue_activity} =  req.body;
            const activityStatus = await logic.create(component_id, name, continue_activity);
            return res.status(activityStatus.status).json(activityStatus.data);
        });
    }

}
export default new ActivityRouter().router