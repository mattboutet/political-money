'use strict';
const Model = require('schwifty').Model;
const Joi = require('joi');

module.exports = (srv, options) => {

    return class Donors extends Model {

        static get tableName() {

            return 'donors';
        }

        static get joiSchema() {

            return Joi.object({

                id: Joi.number(),
                firstName: Joi.string().allow(null),
                lastName: Joi.string().allow(null),
                middleInitial: Joi.string().allow(null),
                suffix: Joi.string().allow(null),
                address1: Joi.string().allow(null),
                address2: Joi.string().allow(null),
                city: Joi.string().allow(null),
                state: Joi.string().allow(null),
                zip: Joi.string().allow(null),
                occupation: Joi.string().allow(null),
                occupationComment: Joi.string().allow(null),
                employmentInfoRequested: Joi.string().allow(null),
                employer: Joi.string().allow(null)
            });
        }

        static get relationMappings() {

            return {
                donations: {
                    relation: Model.HasManyRelation,
                    modelClass: require('./donations')(),
                    join: {
                        from: 'donors.id',
                        to: 'donations.donorId'
                    }
                },
            };
        }
    };
};
