import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";
import authentication from "../../middleware/authentication";
import { ALLROLE } from "../constant";
import validator from "./validator";


class JournalRouter extends BaseRouter {
    routes(): void {
        this.router.get('/:from_date/:to_date',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const { page, size } = req.query
                const { from_date, to_date } = req.params;
                const allJournal = await logic.getAllJournal(Number(page), Number(size), from_date, to_date)
                return res.status(allJournal.status).json(allJournal.data)
            }
        )
        this.router.get('/:uuid',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneJournal = await logic.getJournalByUuid(req.params?.uuid)
                return res.status(oneJournal.status).json(oneJournal.data)
            }
        )
        this.router.get('/status/:status',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allJournal = await logic.getJournalByStatus(req.params?.status)
                return res.status(allJournal.status).json(allJournal.data)
            }
        )
        this.router.get('year/:year',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allJournal = await logic.getJournalByYear(req.params?.year)
                return res.status(allJournal.status).json(allJournal.data)
            }
        )
        this.router.get('/account-id/:account_id',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allJournal = await logic.getJournalByAccountId(req.params?.account_id)
                return res.status(allJournal.status).json(allJournal.data)
            }
        )
        this.router.post('/transaction-date',
            authentication.authenticationUser(ALLROLE),
            validator.date(),
            async (req: Request, res: Response): Promise<Response> => {
                const allJournal = await logic.getJournalByTransactionDate(req.body?.start, req.body?.end)
                return res.status(allJournal.status).json(allJournal.data)
            }
        )
        this.router.post('/',
            authentication.authenticationUser(ALLROLE),
            validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const { from_account, transaction_date, to_account } = req.body;
                const generateJournal = await logic.generateJournal(from_account, transaction_date, to_account)
                return res.status(generateJournal.status).json(generateJournal.data)
            }
        )
    }

}

export default new JournalRouter().router;