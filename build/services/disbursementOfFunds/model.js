"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const model_1 = __importDefault(require("../detailOfActivities/model"));
const model_2 = __importDefault(require("../ptk/model"));
;
const DisbursementOfFunds = database_1.default.define('disbursement_of_funds', {
    uuid: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    amount: {
        type: sequelize_1.DataTypes.BIGINT
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    withdraw: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    accounting_year: {
        type: sequelize_1.DataTypes.STRING
    },
    month_index: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    sharing_program: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    recipient: {
        type: sequelize_1.DataTypes.STRING
    },
    ptk_id: {
        type: sequelize_1.DataTypes.STRING
    },
    activity_id: {
        type: sequelize_1.DataTypes.STRING
    },
    reference_of_jurnal: {
        type: sequelize_1.DataTypes.STRING,
    }
});
model_1.default.hasMany(DisbursementOfFunds, { foreignKey: 'activity_id' });
DisbursementOfFunds.belongsTo(model_1.default, { foreignKey: 'activity_id' });
model_2.default.hasMany(DisbursementOfFunds, { foreignKey: 'ptk_id' });
DisbursementOfFunds.belongsTo(model_2.default, { foreignKey: 'ptk_id' });
exports.default = DisbursementOfFunds;
