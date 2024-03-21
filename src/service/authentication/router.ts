import { Request, Response } from "express";
import BaseRouter from "../../router/base";
import logic from "./logic";
import authentication from "../../middleware/authentication";

class AuthenticationRouter extends BaseRouter {
    routes(): void {
        this.router.post('/login',
            async (req: Request, res: Response): Promise<Response> => {
                const login = await logic.login(req.body.username, req.body.password)
                if (!login.status) {
                    return res.status(403).json({ msg: 'bad request' })
                }
                return res.status(200).json(login)
            })
        this.router.get('/logout',
            async (req: Request, res: Response): Promise<Response> => {
                const logout = await logic.logout(req.app?.locals?.token?.jti)
                if (!logout.status) {
                    return res.status(403).json({ msg: logout.message })
                }
                return res.status(200).json({ msg: logout.message })
            })
    }
}

export default new AuthenticationRouter().router;