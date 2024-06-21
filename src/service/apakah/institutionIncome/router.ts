import BaseRouter from "../../routerBase";
import { Request, Response } from "express";
import logic from "./logic";

class InstitutionIncome extends BaseRouter{
    routes():void{
        this.router.post("/", async(req:Request, res:Response):Promise<Response>=>{
            const {institution_id, academic_year, total, approved_total} = req.body;
            const status = await logic.create(institution_id, academic_year, total, approved_total)
            return res.status(status.status).json(status.data)
        })
        this.router.get("/:institution_id", async(req:Request, res:Response):Promise<Response>=>{
            const {institution_id} = req.params
            const {status_incomes} = req.query;
            let statusQuery: number|undefined = typeof(status_incomes)==='string'? parseInt(status_incomes):undefined
            const status = await logic.getByInstitution(parseInt(institution_id), statusQuery)
            return res.status(status.status).json(status.data)
        })
        this.router.put("/approval/:id", async(req:Request, res:Response):Promise<Response>=>{
            const {approved_total} = req.body;
            const {id} = req.params
            const status = await logic.approval(approved_total, id)
            return res.status(status.status).json(status.data)
        })
        this.router.put("/:id", async(req:Request, res:Response):Promise<Response>=>{
            const {id} = req.params
            const {academic_year, total} = req.body
            const status = await logic.update(academic_year, total, id)
            return res.status(status.status).json(status.data)
        })
    }
}

export default new InstitutionIncome().router