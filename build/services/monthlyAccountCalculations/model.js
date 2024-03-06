"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
;
;
const MonthlyAccountCalulation = database_1.default.define('monthly_account_calculation', {
    uuid: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    month_index: {
        type: sequelize_1.DataTypes.INTEGER
    },
    accounting_year: {
        type: sequelize_1.DataTypes.STRING
    },
    total: {
        type: sequelize_1.DataTypes.BIGINT
    },
    account_id: {
        type: sequelize_1.DataTypes.STRING
    },
    open: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
});
exports.default = MonthlyAccountCalulation;
