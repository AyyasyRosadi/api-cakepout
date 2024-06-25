import BaseRouter from "../../routerBase";
import { Request, Response } from "express";
import logic from "./logic";
import authentication from "../../../middleware/authentication";
import { ALLROLEAPAKAH, SYSTEMAPAKAH } from "../../constant";
import validaor from "./validator";

class ListLembagaApakah extends BaseRouter{
    routes():void{
        this.router.post("/", 
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            validaor.create(),
            async(req:Request, res:Response):Promise<Response>=>{
            const {name} = req.body;
            const createStatus = await logic.create(name)
            return res.status(createStatus.status).json(createStatus.data)
        });
        this.router.get("/", 
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async(req:Request, res:Response):Promise<Response>=>{
            const allLembaga = await logic.getAll()
            return res.status(allLembaga.status).json(allLembaga.data)
        })
    }
}

export default new ListLembagaApakah().router;