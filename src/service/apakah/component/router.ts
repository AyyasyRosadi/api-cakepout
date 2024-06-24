import { queryToString } from "../../../helper/convertQuery";
import BaseRouter from "../../routerBase"
import logic from "./logic";
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

        this.router.delete("/:id", async(req:Request, res:Response):Promise<Response>=>{
            const {id} = req.params
            const status = await logic.delete(id)
            return res.status(status.status).json(status.data)
        })

    }

}
export default new RouterComponent().router