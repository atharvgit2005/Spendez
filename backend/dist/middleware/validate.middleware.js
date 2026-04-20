"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const AppError_1 = require("../errors/AppError");
const errorCodes_1 = require("../errors/errorCodes");
const validate = (schema, source = 'body') => (req, _res, next) => {
    try {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const details = result.error.issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            }));
            return next(new AppError_1.AppError(400, errorCodes_1.ErrorCodes.VALIDATION_ERROR, 'Validation failed', details));
        }
        req[source] = result.data;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.validate = validate;
