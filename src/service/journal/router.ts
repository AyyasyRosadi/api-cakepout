import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";
import authentication from "../../middleware/authentication";
import { ALLROLE, SYSTEMCAKEPOUT } from "../constant";
import validator from "./validator";


class JournalRouter extends BaseRouter {
    routes(): void {
        this.router.get('/',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const { page, size, from_date, to_date } = req.query
                const allJournal = await logic.getAllJournal(Number(page), Number(size), from_date as string, to_date as string)
                return res.status(allJournal.status).json(allJournal.data)
            }
        )
        this.router.get('/:uuid',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const oneJournal = await logic.getJournalByUuid(req.params?.uuid)
                return res.status(oneJournal.status).json(oneJournal.data)
            }
        )
        this.router.get('/status/:status',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allJournal = await logic.getJournalByStatus(req.params?.status)
                return res.status(allJournal.status).json(allJournal.data)
            }
        )
        this.router.get('year/:year',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allJournal = await logic.getJournalByYear(req.params?.year)
                return res.status(allJournal.status).json(allJournal.data)
            }
        )
        this.router.get('/account-id/:account_id',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const allJournal = await logic.getJournalByAccountId(req.params?.account_id)
                return res.status(allJournal.status).json(allJournal.data)
            }
        )
        this.router.post('/transaction-date',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            validator.date(),
            async (req: Request, res: Response): Promise<Response> => {
                const allJournal = await logic.getJournalByTransactionDate(req.body?.start, req.body?.end)
                return res.status(allJournal.status).json(allJournal.data)
            }
        )
        this.router.post('/',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            validator.create(),
            async (req: Request, res: Response): Promise<Response> => {
                const { from_account, transaction_date, to_account, description } = req.body;
                const generateJournal = await logic.generateJournal(from_account, transaction_date, description, to_account)
                return res.status(generateJournal.status).json(generateJournal.data)
            }
        )
        this.router.get('/account/account-begining-balance',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response) => {
                const getAccountBeginingBalance = await logic.getAccountBeginingBalance()
                return res.status(getAccountBeginingBalance.status).json(getAccountBeginingBalance.data)
            })
        this.router.post('/account/account-begining-balance',
            // authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            validator.createBeginingBalance(),
            async (req: Request, res: Response) => {
                const saveAccountBeginingBalance = await logic.saveAccountBeginingBalance(req.body);
                return res.status(saveAccountBeginingBalance.status).json(saveAccountBeginingBalance.data)
            })
        this.router.post('/disbursement-of-fund',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const saveJournalDisbursementOfFund = await logic.generateJournalDisbursementOfFund(req.body.from_account, req.body.transaction_date, req.body?.description, req.body.id, req.body.ptk_id, req.body.receipient)
                return res.status(saveJournalDisbursementOfFund.status).json(saveJournalDisbursementOfFund.data)
            })
        this.router.post('/ledger/close-book',
            authentication.authenticationUser(SYSTEMCAKEPOUT, ALLROLE),
            async (req: Request, res: Response): Promise<Response> => {
                const closeBook = await logic.closeBook(Number(req.query.month_index))
                return res.status(closeBook.status).json(closeBook.data)
            })
    }

}

export default new JournalRouter().router;