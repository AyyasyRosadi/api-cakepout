import { Request, Response } from "express";
import BaseRouter from "../../routerBase";
import logic from "./logic";


class SharingProgramRouter extends BaseRouter {
    routes(): void {
        this.router.get('/', async (req: Request, res: Response): Promise<Response> => {
            const data = await logic.getAllSharingProgram()
            return res.status(data.status).json(data.data)
        })
        this.router.post('/',
            async(req:Request,res:Response):Promise<Response>=>{
                const data = await logic.createSharingProgram(req.body?.name)
                return res.status(data.status).json(data.data)
            }
        )
    }
}

export default new SharingProgramRouter().router;