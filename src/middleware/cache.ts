import { NextFunction,Request,Response } from "express";

export const cache = (req:Request,res:Response,next:NextFunction)=>{
    res.set("Cache-Control", "no-store")
    next()
}