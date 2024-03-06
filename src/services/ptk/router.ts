import logic from "./logic";
import BaseRouter from "../../router/base";
import { Request, Response } from "express";


class PtkRouter extends BaseRouter{
    routes(): void {
        this.router.get('/',async(req:Request,res:Response):Promise<Response> =>{
            const allPtk = await logic.getAllPtk()
            return res.status(200).json(allPtk)
        })
        this.router.get('/:uuid',async(req:Request,res:Response):Promise<Response> =>{
            const onePtk = await logic.getPtkByUuid(req.params?.uuid)
            if(!onePtk){
                return res.status(404).json({msg:'ptk not found'})
            }
            return res.status(200).json(onePtk)
        })
    }
}

export default new PtkRouter().router;