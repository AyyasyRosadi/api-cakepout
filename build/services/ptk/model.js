"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
;
;
const Ptk = database_1.default.define('ptk', {
    uuid: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    nupy: {
        type: sequelize_1.DataTypes.STRING(14)
    },
    nama: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    tempat_lahir: {
        type: sequelize_1.DataTypes.STRING,
    },
    tanggal_lahir: {
        type: sequelize_1.DataTypes.DATEONLY
    }, alamat: {
        type: sequelize_1.DataTypes.STRING
    },
    kecamatan: {
        type: sequelize_1.DataTypes.STRING
    },
    kabupaten: {
        type: sequelize_1.DataTypes.STRING
    },
    provinsi: {
        type: sequelize_1.DataTypes.STRING
    },
    gender: {
        type: sequelize_1.DataTypes.STRING(1)
    },
    no_hp: {
        type: sequelize_1.DataTypes.STRING
    },
    status_pernikahan: {
        type: sequelize_1.DataTypes.STRING
    },
    pendidikan_terakhir: {
        type: sequelize_1.DataTypes.STRING,
    },
    gelar: {
        type: sequelize_1.DataTypes.STRING
    },
    gol_darah: {
        type: sequelize_1.DataTypes.STRING(4)
    },
});
exports.default = Ptk;
