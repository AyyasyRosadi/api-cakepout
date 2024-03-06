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
const detailOfActivities_1 = __importDefault(require("../../helper/detailOfActivities"));
const model_1 = __importDefault(require("../detailOfActivities/model"));
const model_2 = __importDefault(require("./model"));
class DisbursementOfFundLogic {
    getAllDisbursementOfFund() {
        return __awaiter(this, void 0, void 0, function* () {
            const allDisbursementOfFund = yield model_2.default.findAll({ include: { model: model_1.default } });
            return allDisbursementOfFund;
        });
    }
    getDisbursementOfFundByUuid(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const oneDisbursementOfFund = yield model_2.default.findOne({ where: { uuid: uuid }, include: { model: model_1.default } });
            return oneDisbursementOfFund ? oneDisbursementOfFund : null;
        });
    }
    getDisbursementOfFundByActivityId(activity_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const allDisbursementOfFund = yield model_2.default.findAll({ where: { activity_id: activity_id }, include: { model: model_1.default } });
            return allDisbursementOfFund;
        });
    }
    getDisbursementOfFundByPtk_id(ptk_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const allDisbursementOfFund = yield model_2.default.findAll({ where: { ptk_id: ptk_id }, include: { model: model_1.default } });
            return allDisbursementOfFund;
        });
    }
    getDisbursementOfFundByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const allDisbursementOfFund = yield model_2.default.findAll({ where: { status }, include: { model: model_1.default } });
            return allDisbursementOfFund;
        });
    }
    getDisbursementOfFundByWithDraw(withdraw) {
        return __awaiter(this, void 0, void 0, function* () {
            const allDisbursementOfFund = yield model_2.default.findAll({ where: { withdraw }, include: { model: model_1.default } });
            return allDisbursementOfFund;
        });
    }
    addDisbursementOfFund(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            let failedActivity = [];
            for (let i in activity) {
                const checkRemainingAmount_ = yield detailOfActivities_1.default.checkRemainingAmount(activity[i].activity_id, activity[i].amount);
                if (checkRemainingAmount_.status) {
                    yield model_2.default.create({
                        accounting_year: activity[i].accounting_year,
                        activity_id: activity[i].activity_id,
                        amount: activity[i].amount,
                        month_index: activity[i].month_index,
                        sharing_program: activity[i].sharing_program,
                        status: false,
                        withdraw: false,
                    });
                }
                else if (checkRemainingAmount_.remainingAmount !== 0) {
                    failedActivity.push({ activity_id: activity[i].activity_id, remainingAmount: checkRemainingAmount_.remainingAmount });
                }
                else {
                    failedActivity.push({ activity_id: activity[i].activity_id, remainingAmount: 0 });
                }
            }
            if (failedActivity.length > 0) {
                return failedActivity;
            }
            return [];
        });
    }
    approveStatusDisbursementOfFund(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const oneDisbursementOfFund = yield this.getDisbursementOfFundByUuid(uuid);
            if (oneDisbursementOfFund) {
                const checkRemainingAmount_ = yield detailOfActivities_1.default.checkRemainingAmount(oneDisbursementOfFund.activity_id, oneDisbursementOfFund.amount);
                if (!checkRemainingAmount_.status) {
                    return { status: false, message: "amount out of range" };
                }
                !(oneDisbursementOfFund === null || oneDisbursementOfFund === void 0 ? void 0 : oneDisbursementOfFund.status) && (yield detailOfActivities_1.default.updateReceivedAmountDetailOfActivity(oneDisbursementOfFund.activity_id, oneDisbursementOfFund.amount));
                yield model_2.default.update({ status: true }, { where: { uuid } });
                if (oneDisbursementOfFund.sharing_program) {
                    // TODO: add to sharing_program table
                }
                return { status: true, message: "update status succes" };
            }
            return { status: false, message: "disbursement of fund not found" };
        });
    }
    approveWithDrawDisbursementOfFund(uuid, ptk_id, recipient) {
        return __awaiter(this, void 0, void 0, function* () {
            const oneDisbursementOfFund = yield this.getDisbursementOfFundByUuid(uuid);
            if (oneDisbursementOfFund && oneDisbursementOfFund.status) {
                yield model_2.default.update({ withdraw: true, ptk_id: ptk_id, recipient: recipient }, { where: { uuid } });
                return { status: true, message: "update withdraw succes" };
            }
            return { status: false, message: "cannot update withdraw because the status is still false" };
        });
    }
}
exports.default = new DisbursementOfFundLogic;
