import { Request, Response } from "express";
import BaseRouter from "../../router/base";
import logic from "./logic";


class AccountingYearRouter extends BaseRouter {
    routes(): void {
        this.router.get('/', async (req: Request, res: Response): Promise<Response> => {
            const allAccountingYear = await logic.getAllAccountYear()
            return res.status(200).json(allAccountingYear)
        })
        this.router.get('/:status', async (req: Request, res: Response): Promise<Response> => {
            const allAccountingYear = await logic.getAccountingYearByStatus(parseInt(req.params?.status))
            return res.status(200).json(allAccountingYear)
        })
        this.router.post('/', async (req: Request, res: Response): Promise<Response> => {
            const addAccountingYear_ = await logic.addAccountingYear(req.body?.year, req.body?.active)
            if (!addAccountingYear_.status) {
                return res.status(403).json({ msg: addAccountingYear_.message })
            }
            return res.status(200).json({ msg: addAccountingYear_.message })
        })
        this.router.put('/:year', async (req: Request, res: Response): Promise<Response> => {
            const updateAccountingYear_ = await logic.updateStatusAccountingYear(req.params?.year, req.body?.status)
            if (!updateAccountingYear_.status) {
                return res.status(403).json({ msg: updateAccountingYear_.message })
            }
            return res.status(200).json({ msg: updateAccountingYear_.message })
        })
        this.router.delete('/:year', async (req: Request, res: Response): Promise<Response> => {
            const deleteAccountingYear_ = await logic.deleteAccountingYear(req.params?.year)
            if (!deleteAccountingYear_.status) {
                return res.status(403).json({ msg: deleteAccountingYear_.message })
            }
            return res.status(200).json({ msg: deleteAccountingYear_.message })
        })
    }
}

export default new AccountingYearRouter().router;