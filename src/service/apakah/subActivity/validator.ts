import { check } from "express-validator";
import Validator from "../../../middleware/validator";


class SubActivityValidator extends Validator {
    public create = () => [
        check('activity_id').isString().withMessage('tidak boleh kosong'),
        check('name').isString().withMessage('tidak boleh kosong'),
        this.validate
    ]

}

export default new SubActivityValidator;