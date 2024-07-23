import { Request, Response } from "express";
import BaseRouter from "../../routerBase";
import logic from "./logic";
import validator from "./validator";
import authentication from "../../../middleware/authentication";
import { ALLROLECAKEPOUT, SUPERADMINCAKEPOUT, SYSTEMCAKEPOUT } from "../../constant";

class DisbursementOfFundRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLECAKEPOUT),
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.getAllDisbursementOfFund()
                return res.status(data.status).json(data.data)
            })
        this.router.get('/:uuid',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLECAKEPOUT),
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.getDisbursementOfFundByUuid(req.params?.uuid)
                return res.status(data.status).json(data.data)
            })
        this.router.get('/activity/:activity_id',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLECAKEPOUT),
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.getDisbursementOfFundByDetailActivity(req.params?.activity_id)
                return res.status(data.status).json(data.data)
            })
        this.router.get('/ptk/:ptk_id',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLECAKEPOUT),
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.getDisbursementOfFundByPtkId(req.params?.ptk_id)
                return res.status(data.status).json(data.data)
            })
        this.router.get('/status/:status',
            // authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.getDisbursementOfFundByStatus(Number(req.params?.status), Number(req?.query?.page), Number(req.query?.size))
                return res.status(data.status).json(data.data)
            })
        this.router.get('/withdraw/:withdraw',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLECAKEPOUT),
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.getDisbursementOfFundByWithDraw(parseInt(req.params?.withdraw))
                return res.status(data.status).json(data.data)
            })
        this.router.put('/status',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLECAKEPOUT),
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.approveByFinance(req.body?.queue)
                return res.status(data.status).json(data.data)
            })
        this.router.delete('/:uuid',
            authentication.authenticationUser(SYSTEMCAKEPOUT, SUPERADMINCAKEPOUT),
            async (req: Request, res: Response): Promise<Response> => {
                const data = await logic.deleteDisbursementOfFund(req.params?.uuid)
                return res.status(data.status).json(data.data)
            })
    }
}

export default new DisbursementOfFundRouter().router;