import BaseRouter from "../routerBase";
import logic from "./logic";
import { Request, Response } from "express";
import { queryToString } from "../../helper/convertQuery";
import authentication from "../../middleware/authentication";
import { ALLROLEGLOBAL, SYSTEMGLOBAL } from "../constant";

class YearActiveInSystemRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            authentication.authenticationUser(SYSTEMGLOBAL, ALLROLEGLOBAL),
            async (req: Request, res: Response): Promise<Response> => {
                const system = req.query.system;
                const query = queryToString(system)
                console.log(system)
                const status = await logic.get(query)
                return res.status(status.status).json(status.data)
            });
    }
}

export default new YearActiveInSystemRouter().router;