import BaseRouter from "../../routerBase";
import { Request, Response } from "express";
import logic from "./logic";

class ListLembagaApakah extends BaseRouter{
    routes():void{
        this.router.post("/", async(req:Request, res:Response):Promise<Response>=>{
            const {name} = req.body;
            const createStatus = await logic.create(name)
            return res.status(createStatus.status).json(createStatus.data)
        });
        this.router.get("/", async(req:Request, res:Response):Promise<Response>=>{
            return res.status(200).json({msg:"hello"})
        })
    }
}

export default new ListLembagaApakah().router;