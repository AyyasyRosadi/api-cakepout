"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const cache = (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
};
exports.cache = cache;
