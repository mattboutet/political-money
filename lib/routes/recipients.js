'use strict';

const Joi = require('joi');
const Boom = require('boom');

const internals = {};

module.exports = (server, options) => {

    return [
        // - Recipients CRUD -
        {
            method: 'GET',
            path: '/recipients/{id}',
            config: {
                description: 'Get a specific recipient',
                tags: ['api'],
                validate: {
                    params: {
                        id: Joi.any().required()
                    }
                },
                auth: false
            },
            handler: function (request, reply) {

                const Recipients = request.models().Recipients;

                Recipients.query().findById(request.params.id).asCallback((recipientErr, foundRecipient) => {

                    if (recipientErr) {
                        return reply(Boom.wrap(recipientErr));
                    }
                    if (!foundRecipient) {
                        return reply(Boom.notFound('Recipient not found.'));
                    }

                    reply(foundRecipient);
                });
            }
        },
        {
            method: 'GET',
            path: '/recipients/{id}/donations',
            config: {
                description: 'Get all donations for a specific recipient',
                tags: ['api'],
                validate: {
                    params: {
                        id: Joi.any().required()
                    }
                },
                auth: false
            },
            handler: function (request, reply) {

                const Recipients = request.models().Recipients;

                Recipients.query().findById(request.params.id).eager('donations').asCallback((recipientErr, foundRecipient) => {

                    if (recipientErr) {
                        return reply(Boom.wrap(recipientErr));
                    }
                    if (!foundRecipient) {
                        return reply(Boom.notFound('Recipient not found.'));
                    }

                    reply(foundRecipient);
                });
            }
        },
        {
            method: 'GET',
            path: '/recipients/name/{name}/donations',
            config: {
                description: 'Get all donations for a specific recipient, assumes last name, but will accept first name as well',
                tags: ['api'],
                validate: {
                    params: {
                        name: Joi.string().required()
                    }
                },
                auth: false
            },
            handler: function (request, reply) {

                const Recipients = request.models().Recipients;

                Recipients
                    .query()
                    .where('recipientName', 'like', `%${request.params.name}`)
                    .eager('donations.donor')
                    .modifyEager('donations', (builder) => {

                        builder.orderBy('amount', 'desc');
                    })
                    .asCallback((recipientErr, foundRecipient)=> {

                        if (recipientErr) {
                            return reply(Boom.wrap(recipientErr));
                        }
                        if (!foundRecipient) {
                            return reply(Boom.notFound('Recipient not found.'));
                        }

                        reply(foundRecipient);
                });
            }
        },
        {
            method: 'GET',
            path: '/recipients',
            config: {
                description: 'Get all recipients',
                tags: ['api'],
                auth: false
            },
            handler: (request, reply) => {

                const Recipients = request.models().Recipients;

                Recipients.query().asCallback((recipientErr, foundRecipient) => {

                    if (recipientErr){
                        return reply(Boom.wrap(recipientErr));
                    }

                    if (!foundRecipient){
                        return reply(Boom.notFound('No recipients found'));
                    }
                    return reply(foundRecipient);
                });
            }
        },
        // {
        //     method: 'POST',
        //     path: '/recipients',
        //     config: {
        //         tags: ['api'],
        //         description: 'Register new recipient',
        //         validate: {
        //             payload: {
        //                 orgId: Joi.number(),
        //                 recipientType: Joi.string().allow(null),
        //                 recipientName: Joi.string().allow(null)
        //             }
        //         },
        //         auth: false
        //     },
        //     handler: (request, reply) => {
        //
        //         const Recipients = request.models().Recipients;
        //         const Payload = request.payload;
        //
        //         Recipients.query().insertAndFetch({
        //             // email: Payload.email,
        //             // password: hash,
        //             // firstName: Payload.firstName,
        //             // lastName: Payload.lastName
        //         })
        //         .asCallback((error, recipient) => {
        //
        //             if (error){
        //                 return reply(error);
        //             }
        //
        //             return reply(recipient);
        //         });
        //     }
        // },
        // {
        //     method: 'DELETE',
        //     path: '/recipients/{id}',
        //     config: {
        //         description: 'Delete a recipient',
        //         tags: ['api'],
        //         validate: {
        //             params: {
        //                 id: Joi.number().integer().required()
        //             }
        //         },
        //         auth: false
        //     },
        //     handler: (request, reply) => {
        //
        //         const Recipients = request.models().Recipients;
        //         const id = request.params.id;
        //
        //         Recipients.query().deleteById(id)
        //         .asCallback((error, rowsDeleted) => {
        //
        //             if (error){
        //                 return reply(error);
        //             }
        //
        //             if (rowsDeleted === 1) {
        //                 return reply().code(204);
        //             }
        //
        //             return reply(Boom.notFound('Recipient not found'));
        //         });
        //     }
        //},
    ];
};
