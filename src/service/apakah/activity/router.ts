import { queryToString } from "../../../helper/convertQuery";
import BaseRouter from "../../routerBase"
import logic from "./logic";
import { Request, Response } from "express";

class ActivityRouter extends BaseRouter{
    routes(): void {
        this.router.get("/:component_id", async(req:Request, res:Response):Promise<Response>=>{
            const academic_year:string = queryToString(req?.query?.academic_year)
            const data = await logic.getByComponentId(req?.params?.component_id,academic_year)
            return res.status(data.status).json(data.data);
        });
        this.router.post("/", async(req:Request, res:Response):Promise<Response>=>{
            const {component_id, name, continue_activity} =  req.body;
            const activityStatus = await logic.create(component_id, name, continue_activity);
            return res.status(activityStatus.status).json(activityStatus.data);
        });
    }

}
export default new ActivityRouter().router