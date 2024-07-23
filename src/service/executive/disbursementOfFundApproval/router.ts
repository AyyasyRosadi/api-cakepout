import { Request, Response } from "express";
import BaseRouter from "../../routerBase";
import logic from "./logic";


class DisbursementOfFundApprovalRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.getDisbursementOfFund(Number(req.query.institution_no))
                return res.status(data.status).json(data.data)
            }
        )
        this.router.post('/',
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.approveByExecutive(req.body?.queue)
                return res.status(data.status).json(data.data)
            }
        )
    }
}

export default new DisbursementOfFundApprovalRouter().router;