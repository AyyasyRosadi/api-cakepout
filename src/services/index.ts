import express, { Router } from "express";
import Ptk from "./ptk/router";
import DisbursementOfFunds from "./disbursementOfFunds/router";
import DetailOfActivity from "./detailOfActivities/router";
import Account from "./accounts/router";
import JournalReferenceNumber from "./journalReferenceNumbers/router";
import Authentication from "./authentication/router"
import AccountingYear from "./accountingYears/router";

const serviceRouter: Router = express();

serviceRouter.use('/authentication', Authentication)
serviceRouter.use('/ptk', Ptk)
serviceRouter.use('/detail_of_activity', DetailOfActivity)
serviceRouter.use('/disbursement_of_fund', DisbursementOfFunds)
serviceRouter.use('/account', Account)
serviceRouter.use('/journal_reference_number', JournalReferenceNumber)
serviceRouter.use('/accountingYear', AccountingYear)


export default serviceRouter