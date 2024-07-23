import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";


class Validator {
    protected validate = (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        console.log(errors.mapped())
        if (!errors.isEmpty()) {
            return res.status(412).json({msg:"Data invalid"})
        }
        next()
    }
}

export default Validator;