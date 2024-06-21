import { check } from "express-validator";
import Validator from "../../../middleware/validator";

class DisbursementOfFundValidator extends Validator {
    public create = () => [
        check('activity').isArray({ min: 1 }).withMessage("activity tidak boleh kosong"),
        check('activity.*.accounting_year').isString().notEmpty().withMessage('tahun akutansi tidak boleh kosong'),
        check('activity.*.activity_id').isString().notEmpty().withMessage('activity id tidak boleh kosong'),
        check('activity.*.amount').isInt().notEmpty().withMessage('jumlah tidak boleh kosong'),
        check('activity.*.month_index').isInt().notEmpty().withMessage('index bulan tidak boleh kosong'),
        check('activity.*.sharing_program').isBoolean().notEmpty().withMessage('status sharing program tidak boleh kosong'),
        this.validate
    ]
    public updateWithdraw = () => [
        check('ptk_id').optional().isString(),
        check('receipient').optional().isString(),
        check('transaction_date').isString().withMessage('tanggal transaksi tidak boleh kosong'),
        check('accounting_year').isString().withMessage("tahun akutansi tidak boleh kosong"),
        this.validate
    ]
}

export default new DisbursementOfFundValidator