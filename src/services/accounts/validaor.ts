import { check } from "express-validator";
import Validator from "../../middleware/validator";


class AccountValidator extends Validator{
    public type = ()=>[
        check('name').isString().withMessage('name cannot empty'),
        check('group_account').isInt().withMessage('group_account cannot empty'),
        check('group_account_label').isInt().withMessage('group_account_label cannot empty'),
        check('account_number').isString().withMessage('account_number'),
        check('activity_id').isString().withMessage('activity_id cannot empty'),
        this.validate
    ]
}

export default new AccountValidator