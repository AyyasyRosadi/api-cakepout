import express, { Router } from "express";
import DisbursementOfFunds from "./disbursementOfFund/router";
import Account from "./account/router";
import GroupAccount from "./groupAccount/router";
import Journal from "./journal/router";
import Report from "./report/router"
import Ledger from "./ledger/router";
import AccountAutomation from "./accountAutomation/router"


const serviceCakepout: Router = express();

serviceCakepout.use('/disbursement-of-fund', DisbursementOfFunds)
serviceCakepout.use('/account', Account)
serviceCakepout.use('/group-account', GroupAccount)
serviceCakepout.use('/journal', Journal)
serviceCakepout.use('/report', Report)
serviceCakepout.use("/ledger", Ledger)
serviceCakepout.use("/account-automation", AccountAutomation)


export default serviceCakepout