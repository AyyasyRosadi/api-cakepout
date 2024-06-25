import { check } from "express-validator";
import Validator from "../../../middleware/validator";


class IncomeGroupValidator extends Validator {
    public create = () => [
        check('name').isString().withMessage('nama tidak boleh kosong'),
        check('parent_id').isInt().withMessage('rutin tidak boleh kosong'),
        this.validate
    ]

}

export default new IncomeGroupValidator;