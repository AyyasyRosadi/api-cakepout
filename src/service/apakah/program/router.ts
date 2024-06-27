import BaseRouter from "../../routerBase";
import { Request, Response } from "express";
import logic from "./logic";
import { queryToString } from "../../../helper/convertQuery"
import authentication from "../../../middleware/authentication";
import { ALLROLEAPAKAH, SYSTEMAPAKAH } from "../../constant";
import validator from "./validator";

class Program extends BaseRouter {
    routes(): void {
        this.router.post("/",
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const { institution_id, item, academic_year } = req.body;
                const status = await logic.create(institution_id, item, academic_year)
                return res.status(status.status).json(status.data)
        });

        this.router.get("/:institutionId",
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async (req: Request, res: Response): Promise<Response> => {
                const { institutionId } = req.params
                const academic_year: string = queryToString(req.query.academic_year)
                const status = await logic.getAllProgramByInstitution(parseInt(institutionId), academic_year)
                return res.status(status.status).json(status.data)
        });

        this.router.delete("/:id",
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async (req: Request, res: Response): Promise<Response> => {
                const { id } = req.params
                const status = await logic.delete(id)
                return res.status(status.status).json(status.data)
        });

        this.router.put("/:id", 
            async(req:Request, res:Response):Promise<Response>=>{
                const {id} = req.params;
                const {item} = req.body;
                const status = await logic.update(id,item)
                return res.status(status.status).json(status.data)
        });
    }

}

export default new Program().router;