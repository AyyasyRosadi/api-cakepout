import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import logic from "./logic";


class LedgerRouter extends BaseRouter {
    routes(): void {
        this.router.get("/", async (req: Request, res: Response): Promise<Response> => {
            const ledger = await logic.get(Number(req?.query?.month));
            return res.status(ledger.status).json(ledger.data)
        });
        this.router.get("/detail", async (req: Request, res: Response): Promise<Response> => {
            let uuid = req.query.id! as string
            let month = req.query.month! as string
            const ledger = await logic.detail(uuid, parseInt(month))
            return res.status(ledger.status).json(ledger.data)
        });

    }
}

export default new LedgerRouter().router;