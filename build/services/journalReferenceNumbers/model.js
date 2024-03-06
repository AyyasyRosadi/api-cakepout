"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
;
;
const JournalReferenceNumber = database_1.default.define('journal_reference_number', {
    uuid: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    number: {
        type: sequelize_1.DataTypes.INTEGER
    },
    accounting_year: {
        type: sequelize_1.DataTypes.STRING
    }
});
exports.default = JournalReferenceNumber;
