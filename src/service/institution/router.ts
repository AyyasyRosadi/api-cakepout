import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";
import authentication from "../../middleware/authentication";
import { ALLROLE, SYSTEMCAKEPOUT } from "../constant";


class InstitutionRouter extends BaseRouter {
    routes(): void {
        // this.router.get('/',
        // authentication.authenticationUser(SYSTEMCAKEPOUT,ALLROLE),
        //     async (req: Request, res: Response): Promise<Response> => {
        //         const allInstitution = await logic.getAllInstitution()
        //         return res.status(allInstitution.status).json(allInstitution.data)
        //     });
        this.router.post("/", async(req:Request, res:Response):Promise<Response>=>{
            const {name} = req.body;
            const status = await logic.create(name);
            return res.status(status.status).json(status.data);
        })
    }
}

export default new InstitutionRouter().router;