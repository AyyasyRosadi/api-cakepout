import express, { Router } from "express";
import ListLembagaApakah from './instance/router';
import Program from "./program/router";
import InstitutionIncome from './institutionIncome/router';
import Unit from './unit/router';
import Component from "./component/router";
import Activity from './activity/router';
import SubActivity from "./subActivity/router";
import DetailOfActivity from "./detailOfActivities/router";
import IncomeGroug from "./incomeGroup/router";
import Dashboard from './dashboard/router'
import WeightActivityRouter from './weigthActivity/router';
import DisbursementOfFunds from "./disbursmentOfFund/router";
import SharingProgram from "./sharingProgram/router";

const serviceApakah: Router = express();

serviceApakah.use("/institution", ListLembagaApakah);
serviceApakah.use("/program", Program);
serviceApakah.use("/institution-income", InstitutionIncome);
serviceApakah.use("/unit", Unit);
serviceApakah.use("/component", Component);
serviceApakah.use("/activity", Activity);
serviceApakah.use("/sub-activity", SubActivity)
serviceApakah.use("/detail-of-activity", DetailOfActivity)
serviceApakah.use("/income-group", IncomeGroug)
serviceApakah.use("/dashboard", Dashboard)
serviceApakah.use('/weight-activity', WeightActivityRouter)
serviceApakah.use("/disbursement-of-fund", DisbursementOfFunds)
serviceApakah.use("/sharing-program", SharingProgram)

export default serviceApakah;