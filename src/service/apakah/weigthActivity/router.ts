import BaseRouter from "../../routerBase";
import { Request, Response } from "express";
import logic from "./logic";
class WeightActivityRouter extends BaseRouter{
    routes():void{
        // this.router.get("/", async (req: Request, res: Response): Promise<Response>=>{
        //     const status = await logic.generateQuesion()
        //     return res.status(status.status).json(status.data)
        // })
        this.router.get("/question", async(req: Request, res: Response): Promise<Response>=>{
            const question = await logic.getQuestion()
            return res.status(question.status).json(question.data)
        })

        this.router.post("/answer", async(req: Request, res: Response): Promise<Response>=>{
            const {activity_id, answer} = req.body
            const answerStatus = await logic.create(activity_id, answer)
            console.log(answerStatus.data)
            return res.status(answerStatus.status).json(answerStatus.data)
        })
    }
}

export default new WeightActivityRouter().router;