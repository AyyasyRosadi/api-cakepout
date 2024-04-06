import { Request, Response } from "express";
import authentication from "../../middleware/authentication";
import BaseRouter from "../routerBase";
import { ALLROLE, SUPERADMIN } from "../constant";
import logic from "./logic";
import validator from "./validator";


class MonthlyAccountCalculationRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allMonthlyAccountCalculation = await logic.getAllMonthlyAccountCalculation()
                return res.status(200).json(allMonthlyAccountCalculation)
            }
        )
        this.router.get('/:uuid',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneMonthlyAccountCalculation = await logic.getMonthlyAccountCalculationByUuid(req.params?.uuid)
                return res.status(200).json(oneMonthlyAccountCalculation)
            }
        )
        this.router.get('/year/:year',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allMonthlyAccountCalculation = await logic.getMonthlyAccountCalculationByYear(req.params?.year)
                return res.status(200).json(allMonthlyAccountCalculation)
            }
        )
        this.router.get('month/:month_index',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneMonthlyAccountCalculation = await logic.getMonthlyAccountCalculationByMonth(parseInt(req.params?.month_index))
                return res.status(200).json(oneMonthlyAccountCalculation)
            }
        )
        this.router.post('/',
            authentication.authenticationUser(ALLROLE),
            validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const { monthIndex, accountingYear, accountId } = req.body;
                const addMonthlyAccountCalculation = await logic.addMonthlyAccountCalculation(monthIndex, accountingYear, 0, accountId, true)
                if (!addMonthlyAccountCalculation.status) {
                    return res.status(400).json({ msg: addMonthlyAccountCalculation.message })
                }
                return res.status(200).json({ msg: addMonthlyAccountCalculation.message })
            }
        )
        this.router.put('/total/:uuid',
            authentication.authenticationUser(ALLROLE),
            validator.updateTotal(),
            async (req: Request, res: Response): Promise<Response> => {
                const updateTotalMonthlyAccountCalculation = await logic.updateTotalMonthlyAccountCalculation(req.body?.total, req.params?.uuid)
                if (!updateTotalMonthlyAccountCalculation.status) {
                    return res.status(400).json({ msg: updateTotalMonthlyAccountCalculation.message })
                }
                return res.status(200).json({ msg: updateTotalMonthlyAccountCalculation.message })
            }
        )
        this.router.purge('/open/:uuid',
            validator.updateOpen(),
            authentication.authenticationUser(SUPERADMIN),
            async (req: Request, res: Response): Promise<Response> => {
                const updateOpenMonthlyAccountCalculation = await logic.updateOpenMonthlyAccountCalculation(req.body?.open, req.params?.uuid)
                if (!updateOpenMonthlyAccountCalculation.status) {
                    return res.status(400).json({ msg: updateOpenMonthlyAccountCalculation.message })
                }
                return res.status(200).json({ msg: updateOpenMonthlyAccountCalculation.message })
            }
        )
        this.router.delete('/:uuid',
            authentication.authenticationUser(SUPERADMIN),
            async (req: Request, res: Response): Promise<Response> => {
                const deleteMonthlyAccountCalculation = await logic.deleteMonthlyAccountCalculation(req.params?.uuid)
                if (!deleteMonthlyAccountCalculation.status) {
                    return res.status(400).json({ msg: deleteMonthlyAccountCalculation.message })
                }
                return res.status(200).json({ msg: deleteMonthlyAccountCalculation.message })
            }
        )
    }
}

export default new MonthlyAccountCalculationRouter().router;