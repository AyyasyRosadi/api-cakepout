import { Router } from "express";
import InterfaceRouter from "./interfaces";


abstract class BaseRouter implements InterfaceRouter{
    public router:Router;
    constructor(){
        this.router=Router();
        this.routes();
    }

    abstract routes(): void;
}

export default BaseRouter;