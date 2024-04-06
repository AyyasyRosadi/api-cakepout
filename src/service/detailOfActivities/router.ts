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
                return res.status(200).json(allDetailOfActivity)
            })
        this.router.get('/:uuid',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneDetailOfActivity = await logic.getOneDetailActivityByUuid(req.params?.uuid)
                if (!oneDetailOfActivity) {
                    return res.status(404).json({ msg: "detail of activity not found" })
                }
                return res.status(200).json(oneDetailOfActivity)
            })
        this.router.get('/year/:accounting_year',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDetailOfActivity = await logic.getAllDetailOfActivityByYear(req.params?.accounting_year)
                return res.status(200).json(allDetailOfActivity)
            })
        this.router.post('/institution',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDetailOfActivity = await logic.getAllDetailOfActivityByInstitution(req.body?.institutionId)
                return res.status(200).json(allDetailOfActivity)
            })
    }
}

export default new DetailOfActivityRouter().router;