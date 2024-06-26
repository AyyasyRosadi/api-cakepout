import BaseRouter from "../../routerBase";
import { Request, Response } from "express";
import logic from "./logic";
import { queryToString } from "../../../helper/convertQuery";
import authentication from "../../../middleware/authentication";
import { ALLROLEAPAKAH, SYSTEMAPAKAH } from "../../constant";
import validator from "./validator";

class InstitutionIncome extends BaseRouter {
    routes(): void {
        this.router.post("/", 
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
            const { institution_id, academic_year,name, total, income_group_id } = req.body;
            const status = await logic.create(institution_id, academic_year,name, total, income_group_id)
            return res.status(status.status).json(status.data)
        });

        this.router.get("/:institution_id",
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async (req: Request, res: Response): Promise<Response> => {
            const {institution_id} = req.params;
            const academic_year = queryToString(req.query.academic_year)
            const status = await logic.getByInstitutionIdcademic(parseInt(institution_id), academic_year)
            return res.status(status.status).json(status.data)
        });

        this.router.delete("/:id",
            async(req:Request, res:Response):Promise<Response>=>{
                const {id} = req.params
                const status = await logic.delete(id)
                return res.status(status.status).json(status.data) 
        });

        this.router.put("/:id", 
            async(req:Request, res:Response):Promise<Response>=>{
                const {name, total} = req.body;
                const {id} = req.params
                const status  = await logic.update(id, name, total)
                return res.status(status.status).json(status.data)
            });
    }
    
        // this.router.get("/:institution_id/:academic_year", async (req: Request, res: Response): Promise<Response> => {
        //     const { institution_id, academic_year } = req.params
        //     const { status_incomes } = req.query;
        //     let statusQuery: number | undefined = typeof (status_incomes) === 'string' ? parseInt(status_incomes) : undefined
        //     const status = await logic.getByInstitution(parseInt(institution_id), academic_year, statusQuery)
        //     return res.status(status.status).json(status.data)
        // })
        // this.router.put("/approval/:id", async (req: Request, res: Response): Promise<Response> => {
        //     const { approved_total } = req.body;
        //     const { id } = req.params
        //     const status = await logic.approval(approved_total, id)
        //     return res.status(status.status).json(status.data)
        // })
        // this.router.put("/:id", async (req: Request, res: Response): Promise<Response> => {
        //     const { id } = req.params
        //     const { academic_year, total } = req.body
        //     const status = await logic.update(academic_year, total, id)
        //     return res.status(status.status).json(status.data)
        // })
}


export default new InstitutionIncome().router