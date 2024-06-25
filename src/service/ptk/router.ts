import logic from "./logic";
import BaseRouter from "../routerBase";
import { Request, Response } from "express";
import authentication from "../../middleware/authentication";
import { ALLROLECAKEPOUT, SYSTEMCAKEPOUT } from "../constant";


class PtkRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
        authentication.authenticationUser(SYSTEMCAKEPOUT,ALLROLECAKEPOUT),
            async (req: Request, res: Response): Promise<Response> => {
                const allPtk = await logic.getAllPtk()
                return res.status(allPtk.status).json(allPtk.data)
            })
        this.router.get('/:uuid',
        authentication.authenticationUser(SYSTEMCAKEPOUT,ALLROLECAKEPOUT),
            async (req: Request, res: Response): Promise<Response> => {
                const onePtk = await logic.getPtkByUuid(req.params?.uuid)
                return res.status(onePtk.status).json(onePtk.data)
            })
    }
}

export default new PtkRouter().router;