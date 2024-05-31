import express, { Router } from "express";
import Ptk from "./ptk/router";
import DisbursementOfFunds from "./disbursementOfFund/router";
import DetailOfActivity from "./detailOfActivity/router";
import Account from "./account/router";
import Authentication from "./authentication/router"
import AccountingYear from "./accountingYear/router";
import GroupAccount from "./groupAccount/router";
import Institution from "./institution/router";
// import MonthlyAccountCalulation from "./monthlyAccountCalculation/router";
import Journal from "./journal/router";
import SharingProgram from "./sharingProgram/router";
import Report from "./report/router"
import Ledger from "./ledger/router";

const serviceRouter: Router = express();

serviceRouter.use('/authentication', Authentication)
serviceRouter.use('/ptk', Ptk)
serviceRouter.use('/detail-of-activity', DetailOfActivity)
serviceRouter.use('/disbursement-of-fund', DisbursementOfFunds)
serviceRouter.use('/account', Account)
serviceRouter.use('/accounting-year', AccountingYear)
serviceRouter.use('/group-account', GroupAccount)
serviceRouter.use('/institution', Institution)
// serviceRouter.use('/monthly-account-calculation', MonthlyAccountCalulation)
serviceRouter.use('/journal', Journal)
serviceRouter.use('/sharing-program',SharingProgram)
serviceRouter.use('/report', Report)
serviceRouter.use("/ledger", Ledger)


export default serviceRouter