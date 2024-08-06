import express, { Router } from 'express';
import Approval from "./budgetApproval/router"
import DisbursementOfFundApproval from "./disbursementOfFundApproval/router"
import Student from "./student/router"

const serviceExecutive: Router = express();


serviceExecutive.use("/budget-approval", Approval);
serviceExecutive.use("/disbursement-of-fund", DisbursementOfFundApproval)
serviceExecutive.use("/student", Student)


export default serviceExecutive;