import { check } from "express-validator";
import Validator from "../../../middleware/validator";


class InstitutionIncomeValidator extends Validator {
    public create = () => [
        check('institution_id').isInt().withMessage('tidak boleh kosong'),
        check('academic_year').isString().withMessage('tidak boleh kosong'),
        check('name').isString().withMessage('tidak boleh kosong'),
        check('total').isInt().withMessage('tidak boleh kosong'),
        check('income_group_id').isString().withMessage('tidak boleh kosong'),
        this.validate
    ]

}

export default new InstitutionIncomeValidator;