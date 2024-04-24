import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";
import authentication from "../../middleware/authentication";
import { ALLROLE } from "../constant";

class DetailOfActivityRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDetailOfActivity = await logic.getAllDetailOfActivity()
                return res.status(allDetailOfActivity.status).json(allDetailOfActivity.data)
            })
        this.router.get('/:uuid',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneDetailOfActivity = await logic.getOneDetailActivityByUuid(req.params?.uuid)
                return res.status(oneDetailOfActivity.status).json(oneDetailOfActivity.data)
            })
        this.router.get('/year/:accounting_year',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDetailOfActivity = await logic.getAllDetailOfActivityByYear(req.params?.accounting_year)
                return res.status(allDetailOfActivity.status).json(allDetailOfActivity.data)
            })
        this.router.post('/institution',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDetailOfActivity = await logic.getAllDetailOfActivityByInstitution(req.body?.institutionId)
                return res.status(allDetailOfActivity.status).json(allDetailOfActivity.data)
            })
    }
}

export default new DetailOfActivityRouter().router;