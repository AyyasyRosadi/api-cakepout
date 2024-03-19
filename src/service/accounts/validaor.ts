import { check } from "express-validator";
import Validator from "../../middleware/validator";


class AccountValidator extends Validator {
    public add = () => [
        check('name').isString().withMessage('name cannot empty'),
        check('group_account').isInt().withMessage('group_account cannot empty'),
        // check('group_account_label').isInt().withMessage('group_account_label cannot empty'),
        // check('group_account_name').isString().withMessage('activity_id cannot empty'),
        this.validate
    ]
    public update = () => [
        check('name').isString().withMessage('name cannot empty'),
        this.validate
    ]
}

export default new AccountValidator