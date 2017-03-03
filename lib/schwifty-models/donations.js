'use strict';
const Model = require('schwifty').Model;
const Joi = require('joi');

module.exports = (srv, options) => {

    return class Donations extends Model {

        static get tableName() {

            return 'donations';
        }

        static get joiSchema() {

            return Joi.object({

                id: Joi.number(),//receiptID in spreadsheet
                amount: Joi.number().precision(2),
                receiptDate: Joi.date(),
                filedDate: Joi.date(),
                receiptType: Joi.string().allow(null),
                receiptSourceType: Joi.string().allow(null),
                amended: Joi.string().allow(null),
                recipientId: Joi.any(),
                donorId: Joi.any()
            });
        }

        static get relationMappings() {

            return {
                recipient: {
                    relation: Model.BelongsToOneRelation,
                    modelClass: require('./recipients')(),
                    join: {
                        from: 'recipients.id',
                        to: 'donations.recipientId'
                    }
                },
                donor: {
                    relation: Model.BelongsToOneRelation,
                    modelClass: require('./donors')(),
                    join: {
                        from: 'donors.id',
                        to: 'donations.donorId'
                    }
                }
            };
        }
    };
};
