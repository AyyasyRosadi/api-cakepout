import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";


class RoleRouter extends BaseRouter {
    routes(): void {
        this.router.get('/:system_id',
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.getAllRoleBySystem(req?.params?.system_id)
                return res.status(data.status).json(data.data)
            }
        )
        this.router.post('',
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.createRole(req.body?.name, req.body.system_id)
                return res.status(data.status).json(data.data)
            }
        )
    }
}

export default new RoleRouter().router;
