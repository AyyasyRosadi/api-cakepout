import { check } from "express-validator";
import Validator from "../../../middleware/validator";


class DetailValidator extends Validator {
    public create = () => [
        check('activity_id').isString().withMessage('kegiatan tidak boleh kosong'),
        check('detail_of_activity_list').isArray({min:1}).withMessage('detail tidak boleh kosong'),
        check('detail_of_activity_list.*.description').isString().withMessage('sub tidak boleh kosong'),
        check('detail_of_activity_list.*.unit_id').isInt().withMessage('tidak boleh kosong'),
        check('detail_of_activity_list.*.vol').isInt().withMessage('tidak boleh kosong'),
        check('detail_of_activity_list.*.unit_price').isInt().withMessage('tidak boleh kosong'),
        check('detail_of_activity_list.*.thawing_method').isString().withMessage('tidak boleh kosong'),
        check('detail_of_activity_list.*.from').isInt().withMessage('tidak boleh kosong'),
        check('detail_of_activity_list.*.until').isInt().withMessage('tidak boleh kosong'),
        check('detail_of_activity_list.*.total').isInt().withMessage('tidak boleh kosong'),
        check('detail_of_activity_list.*.academic_year').isString().withMessage('tidak boleh kosong'),
        check('detail_of_activity_list.*.institution_income_id').isString().withMessage('tidak boleh kosong'),
        check('detail_of_activity_list.*.sharing_program').isBoolean().withMessage('tidak boleh kosong'),
        check('detail_of_activity_list.*.post').isInt().withMessage('tidak boleh kosong'),
        this.validate
    ]

}

export default new DetailValidator;