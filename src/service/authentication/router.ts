import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";

class AuthenticationRouter extends BaseRouter {
    routes(): void {
        this.router.post('/login',
            async (req: Request, res: Response): Promise<Response> => {
                const login = await logic.login(req.body.username, req.body.password,req.body.system)
                return res.status(login.status).json(login.data)
            })
        this.router.get('/logout',
            async (req: Request, res: Response): Promise<Response> => {
                const logout = await logic.logout(req.app?.locals?.token?.jti)
                return res.status(logout.status).json(logout.data)
            })
    }
}

export default new AuthenticationRouter().router;