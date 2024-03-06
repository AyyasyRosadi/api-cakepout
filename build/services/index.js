"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./ptk/router"));
const router_2 = __importDefault(require("./disbursementOfFunds/router"));
const router_3 = __importDefault(require("./detailOfActivities/router"));
const serviceRouter = (0, express_1.default)();
serviceRouter.use('/ptk', router_1.default);
serviceRouter.use('/detailOfActivity', router_3.default);
serviceRouter.use('/disbursementOfFund', router_2.default);
exports.default = serviceRouter;
