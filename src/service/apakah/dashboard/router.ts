import authentication from "../../../middleware/authentication";
import { ALLROLEAPAKAH, SUPERADMINAPAKAH, SYSTEMAPAKAH } from "../../constant";
import BaseRouter from "../../routerBase";
import logic from "./logic";
import { Request, Response } from "express";

class DashboardRouter extends BaseRouter {
    routes(): void {
        this.router.get("/", 
            authentication.authenticationUser(SYSTEMAPAKAH, SUPERADMINAPAKAH),
            async (req: Request, res: Response): Promise<Response> => {
            const data = await logic.getAll()
            return res.status(data.status).json(data.data)
        });

        this.router.get("/:id",
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
             async (req: Request, res: Response): Promise<Response> => {
            const {id} = req.params
            const data = await logic.getByInstitutionId(parseInt(id))
            return res.status(data.status).json(data.data)
        });

    }
}

export default new DashboardRouter().router