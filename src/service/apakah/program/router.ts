import BaseRouter from "../../routerBase";
import { Request, Response } from "express";
import logic from "./logic";
import {queryToString} from "../../../helper/convertQuery"

class Program extends BaseRouter{
    routes(): void {
        this.router.post("/", async(req:Request, res:Response):Promise<Response>=>{
            const {institution_id, item, academic_year} = req.body;
            const status = await logic.create(institution_id, item, academic_year)
            return res.status(status.status).json(status.data)
        });
        this.router.get("/:institutionId", async(req:Request, res:Response):Promise<Response>=>{
            const {institutionId} = req.params
            const academic_year:string =queryToString(req.query.academic_year)
            const status = await logic.getProgramByInstitution(parseInt(institutionId), academic_year)
            return res.status(status.status).json(status.data)
        });
    }

}

export default  new Program().router;