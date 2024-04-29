import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";


class SharingProgramRouter extends BaseRouter {
    routes(): void {
        this.router.get('/', async (req: Request, res: Response): Promise<Response> => {
            const allSharingProgram = await logic.getAllSharingProgram()
            return res.status(allSharingProgram.status).json(allSharingProgram.data)
        })
    }
}

export default new SharingProgramRouter().router;