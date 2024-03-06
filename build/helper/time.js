"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class TimeHelper {
    formatTime(date) {
        return (0, moment_timezone_1.default)(date).format("YYYY-MM-DD HH:mm:ss");
    }
    formatAsiaMakassar(date) {
        return (0, moment_timezone_1.default)(date).tz('Asia/Makassar').format("YYYY-MM-DD HH:mm:ss");
    }
    formatAsiaJakarta(date) {
        return (0, moment_timezone_1.default)(date).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    }
    formatUtc(date) {
        return (0, moment_timezone_1.default)(date).utc().format("YYYY-MM-DD HH:mm:ss");
    }
    dateAsiaMakassar(date) {
        return (0, moment_timezone_1.default)(date).tz("Asia/Makassar").toDate();
    }
    dateAsiaJakarta(date) {
        return (0, moment_timezone_1.default)(date).tz("Asia/Jakarta").toDate();
    }
    dateUtc(date) {
        return (0, moment_timezone_1.default)(date).utc().toDate();
    }
}
exports.default = new TimeHelper;
