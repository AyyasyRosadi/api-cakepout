import { Request, Response } from "express";
import BaseRouter from "../routerBase";
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
                return res.status(allAccountingYear.status).json(allAccountingYear.data)
            })
        this.router.get('/:status',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allAccountingYear = await logic.getAccountingYearByStatus(parseInt(req.params?.status))
                return res.status(allAccountingYear.status).json(allAccountingYear.data)
            })
        this.router.post('/',
            authentication.authenticationUser(ALLROLE),
            validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const addAccountingYear = await logic.addAccountingYear(req.body?.year, req.body?.active)
                return res.status(addAccountingYear.status).json({ msg: addAccountingYear.data })
            })
        this.router.put('/:year',
            authentication.authenticationUser(ALLROLE),
            validator.update(),
            async (req: Request, res: Response): Promise<Response> => {
                const updateAccountingYear = await logic.updateStatusAccountingYear(req.params?.year, req.body?.status)
                return res.status(updateAccountingYear.status).json({ msg: updateAccountingYear.data })
            })
        this.router.delete('/:year',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const deleteAccountingYear = await logic.deleteAccountingYear(req.params?.year)
                return res.status(deleteAccountingYear.status).json({ msg: deleteAccountingYear.data })
            })
    }
}

export default new AccountingYearRouter().router;