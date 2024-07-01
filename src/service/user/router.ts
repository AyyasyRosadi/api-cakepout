import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import { SYSTEMGLOBAL, ROLESUPERGLOBAL } from "../constant";
import authentication from "../../middleware/authentication";
import logic from "../user/logic";

class UserRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            authentication.authenticationUser(SYSTEMGLOBAL, ROLESUPERGLOBAL),
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.restructurUser()
                return res.status(data.status).json(data.data)
            }
        )
        this.router.post('/',
            authentication.authenticationUser(SYSTEMGLOBAL, ROLESUPERGLOBAL),
            async (req: Request, res: Response): Promise<Response> => {
                const { name, username, password, general_user, sistem } = req.body
                const data = await logic.createUser(name, username, password, general_user, sistem)
                return res.status(data.status).json(data.data)
            }
        )
        this.router.post('/system/:user_id',
            authentication.authenticationUser(SYSTEMGLOBAL, ROLESUPERGLOBAL),
            async (req: Request, res: Response): Promise<Response> => {
                const { system_id, role_id, super_admin, institution_apakah } = req.body;
                const data = await logic.addUserSystem(req.params?.user_id, system_id, role_id, super_admin, institution_apakah)
                return res.status(data.status).json(data.data)
            }
        )
        this.router.put('/profile/:user_id',
            authentication.authenticationUser(SYSTEMGLOBAL, ROLESUPERGLOBAL),
            async (req: Request, res: Response): Promise<Response> => {
                const { name, username, password, general_user } = req.body;
                const data = await logic.updateUser(req.params?.user_id, name, username, password, general_user)
                return res.status(data.status).json(data.data)
            }
        )
        this.router.put('/system/:user_id/:system_id',
            authentication.authenticationUser(SYSTEMGLOBAL, ROLESUPERGLOBAL),
            async (req: Request, res: Response): Promise<Response> => {
                const { super_admin, role_id, institution_apakah } = req.body;
                const data = await logic.updateSystem(req.params?.system_id, req.params?.user_id, super_admin, role_id, institution_apakah)
                return res.status(data.status).json(data.data)
            }
        )

        this.router.delete('/:user_id',
            authentication.authenticationUser(SYSTEMGLOBAL, ROLESUPERGLOBAL),
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.deleteUser(req.params?.user_id)
                return res.status(data.status).json(data.data)
            }
        )

        this.router.delete('/system/:user_id/:system_id',
            authentication.authenticationUser(SYSTEMGLOBAL, ROLESUPERGLOBAL),
            async (req: Request, res: Response): Promise<Response> => {
                console.log(req.params)
                const data = await logic.deleteSystem(req.params?.system_id, req.params?.user_id)
                // return res.status(200).json({message:"Succes"})
                return res.status(data.status).json(data.data)
            }
        )
    }
}

export default new UserRouter().router;