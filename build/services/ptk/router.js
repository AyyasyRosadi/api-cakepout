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
const logic_1 = __importDefault(require("./logic"));
const base_1 = __importDefault(require("../../router/base"));
class PtkRouter extends base_1.default {
    routes() {
        this.router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const allPtk = yield logic_1.default.getAllPtk();
            return res.status(200).json(allPtk);
        }));
        this.router.get('/:uuid', (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const onePtk = yield logic_1.default.getPtkByUuid((_a = req.params) === null || _a === void 0 ? void 0 : _a.uuid);
            if (!onePtk) {
                return res.status(404).json({ msg: 'ptk not found' });
            }
            return res.status(200).json(onePtk);
        }));
    }
}
exports.default = new PtkRouter().router;
