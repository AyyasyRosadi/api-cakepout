import express, { Router } from "express";
import Ptk from "./ptk/router";
import Authentication from "./authentication/router"
import SharingProgram from "./sharingProgram/router";
import AccountingYear from "./accountingYear/router";
import Institution from "./institution/router";
import Apakah from "./apakah"
import Cakepout from "./cakepout";
import YearActiveInSystem from "./yearActiveInSystem/router";

const serviceRouter: Router = express();

serviceRouter.use('/authentication', Authentication)
serviceRouter.use('/ptk', Ptk)
serviceRouter.use('/sharing-program',SharingProgram)
serviceRouter.use('/accounting-year', AccountingYear)
serviceRouter.use('/institution', Institution)
serviceRouter.use("/apakah", Apakah)
serviceRouter.use("/cakepout",Cakepout)
serviceRouter.use("/year-active-system", YearActiveInSystem)



export default serviceRouter