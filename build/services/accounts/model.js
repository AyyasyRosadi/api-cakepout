"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const model_1 = __importDefault(require("../detailOfActivities/model"));
;
;
const Account = database_1.default.define('account', {
    uuid: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    group_account: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    group_account_label: {
        type: sequelize_1.DataTypes.INTEGER
    },
    account_number: {
        type: sequelize_1.DataTypes.STRING
    },
    activity_id: {
        type: sequelize_1.DataTypes.STRING
    }
});
model_1.default.hasOne(Account, { foreignKey: 'activity_id', as: 'detail_of_activity' });
Account.belongsTo(model_1.default, { foreignKey: 'activity_id', as: 'account' });
exports.default = Account;
