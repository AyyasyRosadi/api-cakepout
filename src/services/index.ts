import express, { Router } from "express";
import Ptk from "./ptk/router";
import DisbursementOfFunds from "./disbursementOfFunds/router";
import DetailOfActivity from "./detailOfActivities/router";
import Account from "./accounts/router";
import JournalReferenceNumber from "./journalReferenceNumbers/router";
import Authentication from "./authentication/router"
import AccountingYear from "./accountingYears/router";
import GroupAccount from "./groupAccounts/router";

const serviceRouter: Router = express();

serviceRouter.use('/authentication', Authentication)
serviceRouter.use('/ptk', Ptk)
serviceRouter.use('/detail-of-activity', DetailOfActivity)
serviceRouter.use('/disbursement-of-fund', DisbursementOfFunds)
serviceRouter.use('/account', Account)
serviceRouter.use('/journal-reference-number', JournalReferenceNumber)
serviceRouter.use('/accounting-year', AccountingYear)
serviceRouter.use('/group-account', GroupAccount)


export default serviceRouter