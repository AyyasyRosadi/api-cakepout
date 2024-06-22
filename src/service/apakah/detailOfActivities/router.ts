import { Request, Response } from "express";
import BaseRouter from "../../routerBase";
import logic from "./logic";


class RouterDetailOfActivity extends BaseRouter{
    routes(): void {
        this.router.post("/", async(req:Request, res:Response):Promise<Response>=>{
            const {activity_id, sub_activity_id, detail_of_activity_list} = req.body;
            console.log("apa??")
            const status = await logic.create(activity_id, sub_activity_id, detail_of_activity_list)
            return res.status(status.status).json(status.data)
        });
    }
}

export default new RouterDetailOfActivity().router