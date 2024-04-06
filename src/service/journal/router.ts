import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";
import authentication from "../../middleware/authentication";
import { ALLROLE } from "../constant";
import validator from "./validator";


class JournalRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const {page,size} = req.query
                const allJournal = await logic.getAllJournal(Number(page),Number(size))
                return res.status(200).json(allJournal)
            }
        )
        this.router.get('/:uuid',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneJournal = await logic.getJournalByUuid(req.params?.uuid)
                return res.status(200).json(oneJournal)
            }
        )
        this.router.get('/status/:status',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allJournal = await logic.getJournalByStatus(req.params?.status)
                return res.status(200).json(allJournal)
            }
        )
        this.router.get('year/:year',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allJournal = await logic.getJournalByYear(req.params?.year)
                return res.status(200).json(allJournal)
            }
        )
        this.router.get('/account-id/:account_id',
            authentication.authenticationUser(ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allJournal = await logic.getJournalByAccountId(req.params?.account_id)
                return res.status(200).json(allJournal)
            }
        )
        this.router.post('/transaction-date',
            authentication.authenticationUser(ALLROLE),
            validator.date(),
            async (req: Request, res: Response): Promise<Response> => {
                const allJournal = await logic.getJournalByTransactionDate(req.body?.start, req.body?.end)
                return res.status(200).json(allJournal)
            }
        )
        this.router.post('/',
            authentication.authenticationUser(ALLROLE),
            validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const { from_account, to_account } = req.body;
                const addJournal = await logic.addJournal(from_account, to_account)
                if (!addJournal.status) {
                    return res.status(400).json({ msg: addJournal.message })
                }
                return res.status(200).json({ msg: addJournal.message })
            }
        )
    }

}

export default new JournalRouter().router;