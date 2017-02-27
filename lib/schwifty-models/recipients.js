'use strict';
const Model = require('schwifty').Model;
const Joi = require('joi');

module.exports = (srv, options) => {

    return class Recipients extends Model {

        static get tableName() {

            return 'recipients';
        }

        static get joiSchema() {

            return Joi.object({
                id: Joi.number(),
                recipientType: Joi.string().allow(null),
                recipientName: Joi.string().allow(null)
            });
        }

        static get relationMappings() {

            return {
                donations: {
                    relation: Model.HasManyRelation,
                    modelClass: require('./donations')(),
                    join: {
                        from: 'recipients.id',
                        to: 'donations.recipientId'
                    }
                },
            };
        }
    };
};
