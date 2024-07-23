import authentication from "../../../middleware/authentication";
import { ALLROLEAPAKAH, SYSTEMAPAKAH } from "../../constant";
import BaseRouter from "../../routerBase";
import { Request, Response } from "express";
import logic from "./logic";


class DisbrusmentOfFundApakah extends BaseRouter {
    routes(): void {
        this.router.get("/",
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async (req: Request, res: Response): Promise<Response> => {
                const detailOfActivity = await logic.activity(req.app.locals.user.apakahInstitute)
                return res.status(detailOfActivity.status).json(detailOfActivity.data)
            }
        )
        this.router.post('/',
            // authentication.authenticationUser(SYSTEMAPAKAH, APAKAHROLE),
            // validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const { activity, sharing_program_id } = req.body
                const data = await logic.addDisbursementOfFund(activity, sharing_program_id)
                return res.status(data.status).json(data.data)
            })
    }

}

export default new DisbrusmentOfFundApakah().router