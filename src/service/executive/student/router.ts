import { Request, Response } from "express";
import BaseRouter from "../../routerBase";
import logic from "./logic";

class StudentRouter extends BaseRouter{
    routes(): void {
        this.router.get("/", async(req:Request, res:Response)=>{
            const student = await logic.getStudent()
            return res.status(student.status).json(student.data)
        })
    }
}

export default new StudentRouter().router;