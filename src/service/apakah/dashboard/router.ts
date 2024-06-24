import BaseRouter from "../../routerBase";
import logic from "./logic";
import { Request, Response } from "express";

class DashboardRouter extends BaseRouter {
    routes(): void {
        this.router.get("/", async (req: Request, res: Response): Promise<Response> => {
            const data = await logic.getAll()
            return res.status(data.status).json(data.data)
        });

        this.router.get("/:id", async (req: Request, res: Response): Promise<Response> => {
            const {id} = req.params
            const data = await logic.getByInstitutionId(parseInt(id))
            return res.status(data.status).json(data.data)
        });

    }
}

export default new DashboardRouter().router