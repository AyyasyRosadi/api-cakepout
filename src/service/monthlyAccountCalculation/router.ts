import { Request, Response } from "express";
import authentication from "../../middleware/authentication";
import BaseRouter from "../routerBase";
import { ALLROLE, SUPERADMIN, SYSTEMCAKEPOUT } from "../constant";
import logic from "./logic";
import validator from "./validator";


class MonthlyAccountCalculationRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const { page, size } = req.query
                const allMonthlyAccountCalculation = await logic.getAllMonthlyAccountCalculation(Number(page), Number(size))
                return res.status(allMonthlyAccountCalculation.status).json(allMonthlyAccountCalculation.data)
            }
        )
        this.router.get('/:uuid',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneMonthlyAccountCalculation = await logic.getMonthlyAccountCalculationByUuid(req.params?.uuid)
                return res.status(oneMonthlyAccountCalculation.status).json(oneMonthlyAccountCalculation.data)
            }
        )
        this.router.get('/year/:year',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allMonthlyAccountCalculation = await logic.getMonthlyAccountCalculationByYear(req.params?.year)
                return res.status(allMonthlyAccountCalculation.status).json(allMonthlyAccountCalculation.data)
            }
        )
        this.router.get('month/:month_index',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneMonthlyAccountCalculation = await logic.getMonthlyAccountCalculationByMonth(parseInt(req.params?.month_index))
                return res.status(oneMonthlyAccountCalculation.status).json(oneMonthlyAccountCalculation.data)
            }
        )
        this.router.post('/',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const { month_index, accounting_year, account_id, open } = req.body;
                const addMonthlyAccountCalculation = await logic.addMonthlyAccountCalculation(month_index, accounting_year, 0, account_id, open)
                return res.status(addMonthlyAccountCalculation.status).json(addMonthlyAccountCalculation.data)
            }
        )
        this.router.put('/total/:uuid',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            validator.updateTotal(),
            async (req: Request, res: Response): Promise<Response> => {
                const updateTotalMonthlyAccountCalculation = await logic.updateTotalMonthlyAccountCalculation(req.body?.total, req.params?.uuid)
                return res.status(updateTotalMonthlyAccountCalculation.status).json(updateTotalMonthlyAccountCalculation.data)
            }
        )
        // this.router.put('/open/:uuid',
        //     validator.updateOpen(),
        //     authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
        //     async (req: Request, res: Response): Promise<Response> => {
        //         const updateOpenMonthlyAccountCalculation = await logic.updateOpenMonthlyAccountCalculation(req.body?.open, req.params?.uuid)
        //         return res.status(updateOpenMonthlyAccountCalculation.status).json(updateOpenMonthlyAccountCalculation.data)
        //     }
        // )
        this.router.delete('/:uuid',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const deleteMonthlyAccountCalculation = await logic.deleteMonthlyAccountCalculation(req.params?.uuid)
                return res.status(deleteMonthlyAccountCalculation.status).json(deleteMonthlyAccountCalculation.data)
            }
        )
    }
}

export default new MonthlyAccountCalculationRouter().router;