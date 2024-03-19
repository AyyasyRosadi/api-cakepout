import { check } from "express-validator";
import Validator from "../../middleware/validator";

class DisbursementOfFundValidator extends Validator{
    public add = ()=> [
        check('activity').isArray({min:1}).withMessage("activity must array"),
        check('activity.*.accounting_year').isString().notEmpty().withMessage('accounting year cannot empty'),
        check('activity.*.activity_id').isString().notEmpty().withMessage('activity_id cannot empty'),
        check('activity.*.amount').isInt().notEmpty().withMessage('amount cannot empty'),
        check('activity.*.month_index').isInt().notEmpty().withMessage('month index cannot empty'),
        check('activity.*.sharing_program').isBoolean().notEmpty().withMessage('sharing_program cannot empty'),
        this.validate
    ]
    public withdraw = ()=>[
        check('ptk_id').optional().isString(),
        check('receipient').optional().isString(),
        this.validate
    ]
}

export default new DisbursementOfFundValidator