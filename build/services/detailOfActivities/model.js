"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
;
const DetailOfActivity = database_1.default.define('rincian_kegiatan', {
    uuid: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    uraian: {
        type: sequelize_1.DataTypes.STRING
    },
    id_satuan: {
        type: sequelize_1.DataTypes.INTEGER
    },
    vol: {
        type: sequelize_1.DataTypes.INTEGER
    },
    harga_satuan: {
        type: sequelize_1.DataTypes.INTEGER
    },
    metode_pencairan: {
        type: sequelize_1.DataTypes.STRING
    },
    dari: {
        type: sequelize_1.DataTypes.INTEGER
    },
    sampai: {
        type: sequelize_1.DataTypes.INTEGER
    },
    total: {
        type: sequelize_1.DataTypes.BIGINT
    },
    total_realisasi: {
        type: sequelize_1.DataTypes.BIGINT
    },
    no_sub_kegiatan: {
        type: sequelize_1.DataTypes.STRING
    },
    no_kegiatan: {
        type: sequelize_1.DataTypes.STRING
    },
    tahun_ajar: {
        type: sequelize_1.DataTypes.STRING
    },
    no_pendapatan: {
        type: sequelize_1.DataTypes.STRING
    },
    sharing_program: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
});
exports.default = DetailOfActivity;
