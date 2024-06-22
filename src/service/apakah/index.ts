import express, { Router } from "express";
import ListLembagaApakah from './instance/router';
import Program from "./program/router";
import InstitutionIncome from './institutionIncome/router';
import Unit from './unit/router';
import Component from "./component/router";
import Activity from './activity/router';
import SubActivity from "./subActivity/router";
import DetailOfActivity from "./detailOfActivities/router";


const serviceApakah: Router = express();

serviceApakah.use("/list-lembaga-apakah", ListLembagaApakah);
serviceApakah.use("/program", Program);
serviceApakah.use("/institution-income", InstitutionIncome);
serviceApakah.use("/unit", Unit);
serviceApakah.use("/component", Component);
serviceApakah.use("/activity", Activity);
serviceApakah.use("/sub-activity", SubActivity)
serviceApakah.use("/detail-of-activity", DetailOfActivity)

export default serviceApakah;