import logic from "./logic";
import BaseRouter from "../../router/base";
import { Request, Response } from "express";
import authentication from "../../middleware/authentication";
import { ALLROLE } from "../constant";


class PtkRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allPtk = await logic.getAllPtk()
                return res.status(200).json(allPtk)
            })
        this.router.get('/:uuid',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const onePtk = await logic.getPtkByUuid(req.params?.uuid)
                if (!onePtk) {
                    return res.status(404).json({ msg: 'ptk not found' })
                }
                return res.status(200).json(onePtk)
            })
    }
}

export default new PtkRouter().router;