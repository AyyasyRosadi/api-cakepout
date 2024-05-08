import { check } from "express-validator";
import Validator from "../../middleware/validator";


class AccountValidator extends Validator {
    public create = () => [
        check('name').isString().withMessage('nama akun tidak boleh kosong'),
        check('group_account').isInt().withMessage('grup akun tidak boleh kosong'),
        check('asset').isBoolean().withMessage('asset tidak boleh kosong'),
        this.validate
    ]
    public update = () => [
        check('name').isString().withMessage('nama akun tidak boleh kosong'),
        this.validate
    ]
}

export default new AccountValidator