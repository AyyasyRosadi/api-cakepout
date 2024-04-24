import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";
import authentication from "../../middleware/authentication";
import { ALLROLE } from "../constant";


class InstitutionRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allInstitution = await logic.getAllInstitution()
                return res.status(allInstitution.status).json(allInstitution.data)
            })
    }
}

export default new InstitutionRouter().router;