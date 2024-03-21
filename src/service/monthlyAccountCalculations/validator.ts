import { check } from "express-validator";
import Validator from "../../middleware/validator";


class MonthlyAccountCalculationValidator extends Validator{
    public create = ()=>[
        check('monthIndex').isInt().withMessage('index bulan tidak boleh kosong'),
        check('accountingYear').isString().withMessage('tahun akutansi tidak boleh kosong'),
        check('accountId').isString().withMessage('id akun tidak boleh kosong'),
        this.validate
    ]
    public updateTotal = ()=>[
        check('total').isInt().withMessage('total tidak boleh kosong'),
        this.validate
    ]
    public updateOpen = ()=>[
        check('open').isBoolean().withMessage('status tidak boleh kosong'),
        this.validate
    ]
}

export default new MonthlyAccountCalculationValidator;