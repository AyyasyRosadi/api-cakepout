import { check } from "express-validator";
import Validator from "../../../middleware/validator";


class ComponentValidator extends Validator {
    public create = () => [
        check('item').isString().withMessage('komponen tidak boleh kosong'),
        check('program_id').isString().withMessage('nama tidak boleh kosong'),
        this.validate
    ]

}

export default new ComponentValidator;