import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";



class SystemRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.getAllSystem()
                return res.status(data.status).json(data.data)
            }
        )
        this.router.post('/',
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.createSystem(req.body?.name)
                return res.status(data.status).json(data.data)
            }
        )
    }
}

export default new SystemRouter().router;