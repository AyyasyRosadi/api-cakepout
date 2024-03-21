import { Request, Response } from "express";
import BaseRouter from "../../router/base";
import logic from "./logic";
import authentication from "../../middleware/authentication";
import { ALLROLE } from "../constant";
import validator from "./validator";


class AccountingYearRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allAccountingYear = await logic.getAllAccountYear()
                return res.status(200).json(allAccountingYear)
            })
        this.router.get('/:status',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allAccountingYear = await logic.getAccountingYearByStatus(parseInt(req.params?.status))
                return res.status(200).json(allAccountingYear)
            })
        this.router.post('/',
            authentication.authenticationUser(ALLROLE),
            validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const addAccountingYear_ = await logic.addAccountingYear(req.body?.year, req.body?.active)
                if (!addAccountingYear_.status) {
                    return res.status(403).json({ msg: addAccountingYear_.message })
                }
                return res.status(200).json({ msg: addAccountingYear_.message })
            })
        this.router.put('/:year',
            authentication.authenticationUser(ALLROLE),
            validator.update(),
            async (req: Request, res: Response): Promise<Response> => {
                const updateAccountingYear_ = await logic.updateStatusAccountingYear(req.params?.year, req.body?.status)
                if (!updateAccountingYear_.status) {
                    return res.status(403).json({ msg: updateAccountingYear_.message })
                }
                return res.status(200).json({ msg: updateAccountingYear_.message })
            })
        this.router.delete('/:year',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const deleteAccountingYear_ = await logic.deleteAccountingYear(req.params?.year)
                if (!deleteAccountingYear_.status) {
                    return res.status(403).json({ msg: deleteAccountingYear_.message })
                }
                return res.status(200).json({ msg: deleteAccountingYear_.message })
            })
    }
}

export default new AccountingYearRouter().router;