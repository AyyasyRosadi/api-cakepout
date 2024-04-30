import { Request, Response } from "express";
import BaseRouter from "../routerBase";
import Logic from "./logic";


class ReportRouter extends BaseRouter{
    routes(): void {
        this.router.get("/income-statement", async(req:Request, res:Response):Promise<Response>=>{
            const data = await Logic.incomeStatement(req.params.start, req.params.end)
            return res.status(200).json(data.data)
        })
        this.router.get("/cash-flow-statement", async(req:Request, res:Response):Promise<Response>=>{
            const data = await Logic.cashFlowStatement()
            return res.status(200).json(data.data)
        })
    }
}

export default new ReportRouter().router;