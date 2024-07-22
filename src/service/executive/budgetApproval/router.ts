import BaseRouter from "../../routerBase";
import {Request, Response} from "express";
import { queryToString } from "../../../helper/convertQuery";
import logic from "./logic";

class BudgetApprovalRouter extends BaseRouter{
    routes():void{
        this.router.get("/:institution_no",
            async(req:Request, res:Response)=>{
                const {institution_no} = req.params;
                const status = req.query.status;
                const statusStrig = queryToString(status);
                const  statusActivity = await logic.getActivity(parseInt(statusStrig), parseInt(institution_no));
                return res.status(statusActivity.status).json(statusActivity.data);
            }
        );
        this.router.post("",
            async(req:Request, res:Response)=>{
                const {activity, status} = req.body;
                const save = await logic.approveActivity(status, activity)
                return res.status(save.status).json(save.data)
            }
        )
    
    }
    
}

export default new BudgetApprovalRouter().router