import { check } from "express-validator";
import Validator from "../../../middleware/validator";


class InstitutionApakahValidator extends Validator {
    public create = () => [
        check('name').isString().withMessage('nama tidak boleh kosong'),
        this.validate
    ]

}

export default new InstitutionApakahValidator;