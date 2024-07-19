import express, { Router } from "express";
import Ptk from "./ptk/router";
import Authentication from "./authentication/router"
import SharingProgram from "./sharingProgram/router";
import AccountingYear from "./accountingYear/router";
import Institution from "./institution/router";
import Apakah from "./apakah"
import Cakepout from "./cakepout";
import YearActiveInSystem from "./yearActiveInSystem/router";
import User from "./user/router";
import System from "./system/router";
import Role from "./role/router";
import Executive from "./executive";

const serviceRouter: Router = express();

serviceRouter.use('/authentication', Authentication)
serviceRouter.use('/ptk', Ptk)
serviceRouter.use('/sharing-program', SharingProgram)
serviceRouter.use('/accounting-year', AccountingYear)
serviceRouter.use('/institution', Institution)
serviceRouter.use("/apakah", Apakah)
serviceRouter.use("/cakepout", Cakepout)
serviceRouter.use("/year-active-system", YearActiveInSystem)
serviceRouter.use("/user", User)
serviceRouter.use("/system", System)
serviceRouter.use("/role", Role)
serviceRouter.use("/executive",Executive)



export default serviceRouter