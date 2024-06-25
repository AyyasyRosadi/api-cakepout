import { check } from "express-validator";
import Validator from "../../../middleware/validator";


class ActivityValidator extends Validator {
    public create = () => [
        check('component_id').isString().withMessage('komponen tidak boleh kosong'),
        check('name').isString().withMessage('nama tidak boleh kosong'),
        check('continue_activity').isBoolean().withMessage('rutin tidak boleh kosong'),
        this.validate
    ]

}

export default new ActivityValidator;