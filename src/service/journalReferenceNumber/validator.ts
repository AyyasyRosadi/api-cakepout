import { check } from "express-validator";
import Validator from "../../middleware/validator";


class JournalReferenceNumberValidator extends Validator {
    public type = () => [
        check('number').isInt().withMessage('number cannot empty'),
        check('accounting_year').isString().withMessage('accounting_year cannot empty'),
        this.validate
    ]
}

export default new JournalReferenceNumberValidator;