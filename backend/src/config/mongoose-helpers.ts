import { Schema } from 'mongoose';

/**
 * Adds a virtual 'id' getter that returns the hex string of '_id'
 * and ensures it's included when converting to JSON.
 */
export const addIdVirtual = (schema: Schema) => {
  schema.virtual('id').get(function (this: any) {
    return this._id.toHexString();
  });
  
  const toJSON = (schema as any).options.toJSON || {};
  schema.set('toJSON', {
    ...toJSON,
    virtuals: true,
  });
};
