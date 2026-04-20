"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addIdVirtual = void 0;
/**
 * Adds a virtual 'id' getter that returns the hex string of '_id'
 * and ensures it's included when converting to JSON.
 */
const addIdVirtual = (schema) => {
    schema.virtual('id').get(function () {
        return this._id.toHexString();
    });
    const toJSON = schema.options.toJSON || {};
    schema.set('toJSON', {
        ...toJSON,
        virtuals: true,
    });
};
exports.addIdVirtual = addIdVirtual;
