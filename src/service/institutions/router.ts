import { Request, Response } from "express";
import BaseRouter from "../../router/base";
import logic from "./logic";
import authentication from "../../middleware/authentication";
import { ALLROLE } from "../constant";


class InstitutionRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allInstitution = await logic.getAllInstitution()
                return res.status(200).json(allInstitution)
            })
    }
}

export default new InstitutionRouter().router;