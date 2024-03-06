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
const base_1 = __importDefault(require("../../router/base"));
const logic_1 = __importDefault(require("./logic"));
class DisbursementOfFundRouter extends base_1.default {
    routes() {
        this.router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const allDisbursementOfFund = yield logic_1.default.getAllDisbursementOfFund();
            return res.status(200).json(allDisbursementOfFund);
        }));
        this.router.get('/:uuid', (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const oneDisbursementOfFund = yield logic_1.default.getDisbursementOfFundByUuid((_a = req.params) === null || _a === void 0 ? void 0 : _a.uuid);
            if (!oneDisbursementOfFund) {
                return res.status(404).json({ msg: "disbursement of fund not found" });
            }
            return res.status(200).json(oneDisbursementOfFund);
        }));
        this.router.get('/activity/:activity_id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const allDisbursementOfFund = yield logic_1.default.getDisbursementOfFundByActivityId((_b = req.params) === null || _b === void 0 ? void 0 : _b.activity_id);
            return res.status(200).json(allDisbursementOfFund);
        }));
        this.router.get('/ptk/:ptk_id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const allDisbursementOfFund = yield logic_1.default.getDisbursementOfFundByPtk_id((_c = req.params) === null || _c === void 0 ? void 0 : _c.ptk_id);
            return res.status(200).json(allDisbursementOfFund);
        }));
        this.router.get('/status/:status', (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            const allDisbursementOfFund = yield logic_1.default.getDisbursementOfFundByStatus(parseInt((_d = req.params) === null || _d === void 0 ? void 0 : _d.status));
            return res.status(200).json(allDisbursementOfFund);
        }));
        this.router.get('/withdraw/:withdraw', (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _e;
            const allDisbursementOfFund = yield logic_1.default.getDisbursementOfFundByWithDraw(parseInt((_e = req.params) === null || _e === void 0 ? void 0 : _e.withdraw));
            return res.status(200).json(allDisbursementOfFund);
        }));
        this.router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { activity } = req.body;
            const addDisbursementOfFund = yield logic_1.default.addDisbursementOfFund(activity);
            console.log(addDisbursementOfFund);
            return res.status(200).json({ msg: addDisbursementOfFund });
        }));
        this.router.put('/status/:uuid', (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _f;
            const approveStatusDisbursementOfFund = yield logic_1.default.approveStatusDisbursementOfFund((_f = req.params) === null || _f === void 0 ? void 0 : _f.uuid);
            if (!approveStatusDisbursementOfFund.status) {
                return res.status(400).json({ msg: approveStatusDisbursementOfFund.message });
            }
            return res.status(200).json({ msg: approveStatusDisbursementOfFund.message });
        }));
        this.router.put('/withdraw/:uuid', (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _g;
            const { ptk_id, recipient } = req.body;
            const approveWithDrawDisbursementOfFund = yield logic_1.default.approveWithDrawDisbursementOfFund((_g = req.params) === null || _g === void 0 ? void 0 : _g.uuid, ptk_id, recipient);
            if (!approveWithDrawDisbursementOfFund.status) {
                return res.status(400).json({ msg: approveWithDrawDisbursementOfFund.message });
            }
            return res.status(200).json({ msg: approveWithDrawDisbursementOfFund.message });
        }));
    }
}
exports.default = new DisbursementOfFundRouter().router;
