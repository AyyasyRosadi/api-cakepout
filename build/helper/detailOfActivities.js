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
const model_1 = __importDefault(require("../services/detailOfActivities/model"));
class DetailOfActivityHelper {
    getAmountDetailOfActivity(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const oneDetailOfActivity = yield model_1.default.findOne({ where: { uuid } });
            if (!oneDetailOfActivity) {
                return null;
            }
            return { amount: oneDetailOfActivity === null || oneDetailOfActivity === void 0 ? void 0 : oneDetailOfActivity.total, receivedAmount: oneDetailOfActivity === null || oneDetailOfActivity === void 0 ? void 0 : oneDetailOfActivity.total_realisasi };
        });
    }
    checkRemainingAmount(uuid, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const oneActivity = yield this.getAmountDetailOfActivity(uuid);
            // get amount & receivedAmount
            if (oneActivity && oneActivity.amount >= (oneActivity.receivedAmount + amount)) {
                return { status: true, remainingAmount: oneActivity.amount - (oneActivity.receivedAmount + amount) };
            }
            else if (oneActivity) {
                return { status: false, remainingAmount: oneActivity.amount - oneActivity.receivedAmount };
            }
            return { status: false, remainingAmount: 0 };
        });
    }
    updateReceivedAmountDetailOfActivity(uuid, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const oneDetailOfActivity = yield this.getAmountDetailOfActivity(uuid);
            if (oneDetailOfActivity) {
                const result = (oneDetailOfActivity === null || oneDetailOfActivity === void 0 ? void 0 : oneDetailOfActivity.receivedAmount) + amount;
                yield model_1.default.update({ total_realisasi: result }, { where: { uuid } });
                return true;
            }
            return false;
        });
    }
}
exports.default = new DetailOfActivityHelper;
