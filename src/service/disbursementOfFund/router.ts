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
                return res.status(200).json(allDisbursementOfFund)
            })
        this.router.get('/:uuid',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneDisbursementOfFund = await logic.getDisbursementOfFundByUuid(req.params?.uuid)
                if (!oneDisbursementOfFund) {
                    return res.status(404).json({ msg: "disbursement of fund not found" })
                }
                return res.status(200).json(oneDisbursementOfFund)
            })
        this.router.get('/activity/:activity_id',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDisbursementOfFund = await logic.getDisbursementOfFundByActivityId(req.params?.activity_id)
                return res.status(200).json(allDisbursementOfFund)
            })
        this.router.get('/ptk/:ptk_id',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDisbursementOfFund = await logic.getDisbursementOfFundByPtk_id(req.params?.ptk_id)
                return res.status(200).json(allDisbursementOfFund)
            })
        this.router.get('/status/:status',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDisbursementOfFund = await logic.getDisbursementOfFundByStatus(parseInt(req.params?.status))
                return res.status(200).json(allDisbursementOfFund)
            })
        this.router.get('/withdraw/:withdraw',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allDisbursementOfFund = await logic.getDisbursementOfFundByWithDraw(parseInt(req.params?.withdraw))
                return res.status(200).json(allDisbursementOfFund)
            })
        this.router.post('/',
            authentication.authenticationUser(ALLROLE),
            validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const { activity } = req.body
                const addDisbursementOfFund = await logic.addDisbursementOfFund(activity)
                return res.status(200).json({ msg: addDisbursementOfFund })
            })
        this.router.put('/status/:uuid',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const approveStatusDisbursementOfFund = await logic.approveStatusDisbursementOfFund(req.params?.uuid)
                if (!approveStatusDisbursementOfFund.status) {
                    return res.status(400).json({ msg: approveStatusDisbursementOfFund.message })
                }
                return res.status(200).json({ msg: approveStatusDisbursementOfFund.message })
            })
        this.router.put('/withdraw/:uuid',
            authentication.authenticationUser(ALLROLE),
            validator.updateWithdraw(),
            async (req: Request, res: Response): Promise<Response> => {
                const { ptk_id, recipient } = req.body;
                const approveWithDrawDisbursementOfFund = await logic.approveWithDrawDisbursementOfFund(req.params?.uuid, ptk_id, recipient)
                if (!approveWithDrawDisbursementOfFund.status) {
                    return res.status(400).json({ msg: approveWithDrawDisbursementOfFund.message })
                }
                return res.status(200).json({ msg: approveWithDrawDisbursementOfFund.message })
            })
        this.router.delete('/:uuid',
            authentication.authenticationUser(SUPERADMIN),
            async (req: Request, res: Response): Promise<Response> => {
                const deleteDisbursementOfFund = await logic.deleteDisbursementOfFund(req.params?.uuid)
                if (!deleteDisbursementOfFund) {
                    return res.status(400).json({ msg: "bad request" })
                }
                return res.status(200).json({ msg: "delete succes" })
            })
    }
}

export default new DisbursementOfFundRouter().router;