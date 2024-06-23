import { queryToString } from "../../../helper/convertQuery";
import BaseRouter from "../../routerBase"
import Logic from "./logic";
import { Request, Response } from "express";

class RouterComponent extends BaseRouter{
    routes(): void {
        this.router.get("/:program_id", async(req:Request, res:Response):Promise<Response>=>{
            const {program_id} = req.params;
            const data = await Logic.getAllComponentByProgramId(program_id)
            return res.status(data.status).json(data.data)
        });
        this.router.post("/", async(req:Request, res:Response):Promise<Response>=>{
            const {item, program_id} = req.body;
            const status = await Logic.create(program_id, item)
            return res.status(status.status).json(status.data)
        });
    }

}
export default new RouterComponent().router