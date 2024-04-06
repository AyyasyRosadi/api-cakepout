import { check } from "express-validator";
import Validator from "../../middleware/validator";


class AccountingYearValidator extends Validator{
    public create = ()=>[
        check('year').isString().withMessage('tahun tidak boleh kosong'),
        check('active').isBoolean().withMessage('status tidak boleh kosong'),
        this.validate
    ]
    public update = ()=>[
        check('active').isBoolean().withMessage('status tidak boleh kosong'),
        this.validate
    ]
}

export default new AccountingYearValidator;