"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Synchronize = void 0;
const model_1 = __importDefault(require("../services/accounts/model"));
const model_2 = __importDefault(require("../services/detailOfActivities/model"));
const model_3 = __importDefault(require("../services/disbursementOfFunds/model"));
const model_4 = __importDefault(require("../services/journalReferenceNumbers/model"));
const model_5 = __importDefault(require("../services/journals/model"));
const model_6 = __importDefault(require("../services/monthlyAccountCalculations/model"));
const model_7 = __importDefault(require("../services/ptk/model"));
const database_1 = __importDefault(require("./database"));
const Synchronize = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.authenticate();
        yield model_7.default.sync();
        yield model_2.default.sync();
        yield model_4.default.sync({ alter: true });
        yield model_1.default.sync({ alter: true });
        yield model_5.default.sync({ alter: true });
        yield model_6.default.sync({ alter: true });
        yield model_3.default.sync({ alter: true });
    }
    catch (err) {
        throw err;
    }
});
exports.Synchronize = Synchronize;
