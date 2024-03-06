import express, { Router } from "express";
import Ptk from "./ptk/router";
import DisbursementOfFunds from "./disbursementOfFunds/router";
import DetailOfActivity from "./detailOfActivities/router";

const serviceRouter: Router = express();

serviceRouter.use('/ptk', Ptk)
serviceRouter.use('/detailOfActivity', DetailOfActivity)
serviceRouter.use('/disbursementOfFund', DisbursementOfFunds)


export default serviceRouter