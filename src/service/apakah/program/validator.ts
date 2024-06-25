import { check } from "express-validator";
import Validator from "../../../middleware/validator";


class ProgramValidator extends Validator {
    public create = () => [
        check('institution_id').isInt().withMessage('tidak boleh kosong'),
        check('academic_year').isString().withMessage('tidak boleh kosong'),
        check('item').isString().withMessage('tidak boleh kosong'),
        this.validate
    ]

}

export default new ProgramValidator;