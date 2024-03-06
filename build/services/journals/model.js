"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const model_1 = __importDefault(require("../accounts/model"));
;
;
const Journal = database_1.default.define('journal', {
    uuid: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    reference: {
        type: sequelize_1.DataTypes.STRING
    },
    transaction_date: {
        type: sequelize_1.DataTypes.DATE
    },
    amount: {
        type: sequelize_1.DataTypes.BIGINT
    },
    status: {
        type: sequelize_1.DataTypes.STRING(1)
    },
    accounting_year: {
        type: sequelize_1.DataTypes.STRING
    },
    account_id: {
        type: sequelize_1.DataTypes.STRING
    }
});
model_1.default.hasMany(Journal, { foreignKey: 'account_id' });
Journal.belongsTo(model_1.default, { foreignKey: 'account_id' });
exports.default = Journal;
