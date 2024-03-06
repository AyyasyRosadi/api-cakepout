"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
class Validator {
    constructor() {
        this.validate = (req, res, next) => {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(403).json(errors.mapped());
            }
            next();
        };
    }
}
exports.default = Validator;
