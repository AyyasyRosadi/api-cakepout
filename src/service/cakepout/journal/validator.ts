import { check } from "express-validator";
import Validator from "../../../middleware/validator";


class JournalValidator extends Validator {
    public date = () => [
        check('start').isString().withMessage('tanggal mulai tidak boleh kosong'),
        check('end').isString().withMessage('tanggal selesai tidak boleh kosong'),
        this.validate
    ]
    public create = () => [
        check('from_account').isString().withMessage('akun sumber tidak boleh kosong'),
        check('transaction_date').isString().withMessage('tanggal transaksi tidak boleh kosong'),
        check('to_account').isArray({ min: 1 }),
        check('to_account.*.account_id').isString().withMessage('akun tidak boleh kosong'),
        check('to_account.*.amount').isInt().withMessage('jumlah tidak boleh kosong'),
        // check('to_account.*.reference').isString().withMessage('referensi tidak boleh kosong'),
        this.validate
    ]
    public createBeginingBalance = ()=>[
        check("harta").isArray({min:1}).withMessage("harta tidak boleh kosong"),
        check("kewajiban").isArray({min:1}).withMessage("harta tidak boleh kosong"),
        check("modal").isArray({min:1}).withMessage("harta tidak boleh kosong"),
        check("description").isString().withMessage('deskripsi tidak boleh kosong'),
        check('account_balancing').isInt(),
        this.validate
    ]
}

export default new JournalValidator