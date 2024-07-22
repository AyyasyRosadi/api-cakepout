import authentication from "../../../middleware/authentication";
import { ALLROLEAPAKAH, SYSTEMAPAKAH } from "../../constant";
import BaseRouter from "../../routerBase";
import { Request, Response } from "express";
import logic from "./logic";


class DisbrusmentOfFundApakah extends BaseRouter{
    routes(): void {
        this.router.get("/", 
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async(req:Request, res:Response):Promise<Response>=>{
                const detailOfActivity = await logic.activity(req.app.locals.user.apakahInstitute)
                return res.status(detailOfActivity.status).json(detailOfActivity.data)
            }
        )
    }
}

export default new DisbrusmentOfFundApakah().router