import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";
import validator from "./validator";
import authentication from "../../middleware/authentication";
import { ALLROLE, SUPERADMIN } from "../constant";

class DisbursementOfFundRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDisbursementOfFund = await logic.getAllDisbursementOfFund()
                return res.status(allDisbursementOfFund.status).json(allDisbursementOfFund.data)
            })
        this.router.get('/:uuid',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneDisbursementOfFund = await logic.getDisbursementOfFundByUuid(req.params?.uuid)
                return res.status(oneDisbursementOfFund.status).json(oneDisbursementOfFund.data)
            })
        this.router.get('/activity/:activity_id',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDisbursementOfFund = await logic.getDisbursementOfFundByActivityId(req.params?.activity_id)
                return res.status(allDisbursementOfFund.status).json(allDisbursementOfFund.data)
            })
        this.router.get('/ptk/:ptk_id',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDisbursementOfFund = await logic.getDisbursementOfFundByPtk_id(req.params?.ptk_id)
                return res.status(allDisbursementOfFund.status).json(allDisbursementOfFund.data)
            })
        this.router.get('/status/:status',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDisbursementOfFund = await logic.getDisbursementOfFundByStatus(parseInt(req.params?.status))
                return res.status(allDisbursementOfFund.status).json(allDisbursementOfFund.data)
            })
        this.router.get('/withdraw/:withdraw',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDisbursementOfFund = await logic.getDisbursementOfFundByWithDraw(parseInt(req.params?.withdraw))
                return res.status(allDisbursementOfFund.status).json(allDisbursementOfFund.data)
            })
        this.router.post('/',
            authentication.authenticationUser(ALLROLE),
            validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const { activity } = req.body
                const addDisbursementOfFund = await logic.addDisbursementOfFund(activity)
                return res.status(addDisbursementOfFund.status).json(addDisbursementOfFund.data)
            })
        this.router.put('/status/:uuid',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const approveStatusDisbursementOfFund = await logic.approveStatusDisbursementOfFund(req.params?.uuid)
                return res.status(approveStatusDisbursementOfFund.status).json(approveStatusDisbursementOfFund.data)
            })
        this.router.put('/withdraw/:uuid',
            authentication.authenticationUser(ALLROLE),
            validator.updateWithdraw(),
            async (req: Request, res: Response): Promise<Response> => {
                const { ptk_id, recipient } = req.body;
                const approveWithDrawDisbursementOfFund = await logic.approveWithDrawDisbursementOfFund(req.params?.uuid, ptk_id, recipient)
                return res.status(approveWithDrawDisbursementOfFund.status).json(approveWithDrawDisbursementOfFund.data)
            })
        this.router.delete('/:uuid',
            authentication.authenticationUser(SUPERADMIN),
            async (req: Request, res: Response): Promise<Response> => {
                const deleteDisbursementOfFund = await logic.deleteDisbursementOfFund(req.params?.uuid)
                return res.status(deleteDisbursementOfFund.status).json(deleteDisbursementOfFund.data)
            })
    }
}

export default new DisbursementOfFundRouter().router;