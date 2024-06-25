import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";
import authentication from "../../middleware/authentication";
import { ALLROLEGLOBAL, SYSTEMGLOBAL } from "../constant";

class InstitutionRouter extends BaseRouter {
    routes(): void {
        // this.router.get('/',
        // authentication.authenticationUser(SYSTEMCAKEPOUT,ALLROLE),
        //     async (req: Request, res: Response): Promise<Response> => {
        //         const allInstitution = await logic.getAllInstitution()
        //         return res.status(allInstitution.status).json(allInstitution.data)
        //     });
        this.router.get("/", 
            authentication.authenticationUser(SYSTEMGLOBAL, ALLROLEGLOBAL),
            async(req:Request, res:Response)=>{
            const status = await logic.getAllInstitution();
            return res.status(status.status).json(status.data)
        });
        this.router.post("/", 
            authentication.authenticationUser(SYSTEMGLOBAL, ALLROLEGLOBAL),
            async(req:Request, res:Response):Promise<Response>=>{
            const {name, academic_year} = req.body;
            const status = await logic.create(name, academic_year);
            return res.status(status.status).json(status.data);
        });
    }
}

export default new InstitutionRouter().router;