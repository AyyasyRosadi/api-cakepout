import express, { Router } from "express";
import Ptk from "./ptk/router";
import DisbursementOfFunds from "./disbursementOfFunds/router";
import DetailOfActivity from "./detailOfActivities/router";
import Account from "./accounts/router";
import JournalReferenceNumber from "./journalReferenceNumbers/router";

const serviceRouter: Router = express();

serviceRouter.use('/ptk', Ptk)
serviceRouter.use('/detailOfActivity', DetailOfActivity)
serviceRouter.use('/disbursementOfFund', DisbursementOfFunds)
serviceRouter.use('/account', Account)
serviceRouter.use('/journalReferenceNumber', JournalReferenceNumber)


export default serviceRouter