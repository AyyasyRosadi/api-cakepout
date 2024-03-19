import { Request, Response } from "express";
import BaseRouter from "../../router/base";
import logic from "./logic";

class DetailOfActivityRouter extends BaseRouter {
    routes(): void {
        this.router.get('/', async (req: Request, res: Response): Promise<Response> => {
            const allDetailOfActivity = await logic.getAllDetailOfActivity()
            return res.status(200).json(allDetailOfActivity)
        })
        this.router.get('/:uuid', async (req: Request, res: Response): Promise<Response> => {
            const oneDetailOfActivity = await logic.getOneDetailActivityByUuid(req.params?.uuid)
            if (!oneDetailOfActivity) {
                return res.status(404).json({ msg: "detail of activity not found" })
            }
            return res.status(200).json(oneDetailOfActivity)
        })
        this.router.get('/year/:accounting_year', async (req: Request, res: Response): Promise<Response> => {
            const allDetailOfActivity = await logic.getAllDetailOfActivityByYear(req.params?.accounting_year)
            return res.status(200).json(allDetailOfActivity)
        })
    }
}

export default new DetailOfActivityRouter().router;