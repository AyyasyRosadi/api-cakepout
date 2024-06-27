import authentication from "../../../middleware/authentication";
import { ALLROLEAPAKAH, SYSTEMAPAKAH } from "../../constant";
import BaseRouter from "../../routerBase"
import logic from "./logic";
import Logic from "./logic";
import { Request, Response } from "express";
import validator from "./validator";

class RouterComponent extends BaseRouter{
    routes(): void {
        this.router.get("/:program_id", 
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async(req:Request, res:Response):Promise<Response>=>{
            const {program_id} = req.params;
            const data = await Logic.getAllComponentByProgramId(program_id)
            return res.status(data.status).json(data.data)
        });
        this.router.post("/", 
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            validator.create(),
            async(req:Request, res:Response):Promise<Response>=>{
            const {item, program_id} = req.body;
            const status = await Logic.create(program_id, item)
            return res.status(status.status).json(status.data)
        });

        this.router.delete("/:id", 
            authentication.authenticationUser(SYSTEMAPAKAH, ALLROLEAPAKAH),
            async(req:Request, res:Response):Promise<Response>=>{
            const {id} = req.params
            const status = await logic.delete(id)
            return res.status(status.status).json(status.data)
        });

        this.router.put("/:id", 
            async(req:Request, res:Response):Promise<Response>=>{
               const {id} = req.params;
               const {item} = req.params;
               const status = await logic.update(id, item)
               return res.status(status.status).json(status.data) 
        });

    }

}
export default new RouterComponent().router