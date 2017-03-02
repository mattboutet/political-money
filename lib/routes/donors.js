'use strict';

const Joi = require('joi');
const Boom = require('boom');

const internals = {};

module.exports = (server, options) => {

    return [
        // - Donors CRUD -
        {
            method: 'GET',
            path: '/donors/{id}',
            config: {
                description: 'Get a specific donor',
                tags: ['api'],
                validate: {
                    params: {
                        id: Joi.any().required()
                    }
                },
                auth: false
            },
            handler: function (request, reply) {

                const Donors = request.models().Donors;

                Donors.query().findById(request.params.id).asCallback((donorErr, foundDonor) => {

                    if (donorErr) {
                        return reply(Boom.wrap(donorErr));
                    }
                    if (!foundDonor) {
                        return reply(Boom.notFound('Donor not found.'));
                    }

                    reply(foundDonor);
                });
            }
        },
        {
            method: 'GET',
            path: '/donors/{id}/donations',
            config: {
                description: 'Get all donations specific donor',
                tags: ['api'],
                validate: {
                    params: {
                        id: Joi.any().required()
                    }
                },
                auth: false
            },
            handler: function (request, reply) {

                const Donors = request.models().Donors;

                Donors.query().findById(request.params.id).eager('donations').asCallback((donorErr, foundDonor) => {

                    if (donorErr) {
                        return reply(Boom.wrap(donorErr));
                    }
                    if (!foundDonor) {
                        return reply(Boom.notFound('Donor not found.'));
                    }

                    reply(foundDonor);
                });
            }
        },
        {
            method: 'GET',
            path: '/donors/topDonors',
            config: {
                description: 'Get top 100 donors by $ amount',
                tags: ['api'],
                auth: false
            },
            handler: function (request, reply) {

                const Donors = request.models().Donors;
                const Donations = request.models().Donations;

                Donations.query().select(Donations.raw('donations.donorId, donors.firstName as donorFirstName, donors.lastName as donorLastName, recipients.id as orgId, recipientName, SUM(amount) as total, donations.id as receiptId'))
                .whereNot({ recipientType: 'Ballot Question Committee' })
                .join('donors', 'donors.id', '=', 'donations.donorId')
                .join('recipients', 'recipients.id', '=', 'donations.recipientId')
                .groupBy('donorId', 'recipientId').orderBy('total', 'desc').limit(100).asCallback((donationErr, topDonations) => {

                    if (donationErr) {
                        return reply(Boom.wrap(donationErr));
                    }
                    if (!topDonations) {
                        return reply(Boom.notFound('Donations not found.'));
                    }

                    reply(topDonations);
                });
            }
        },
        {
            method: 'GET',
            path: '/donors',
            config: {
                description: 'Get all donors',
                tags: ['api'],
                auth: false
            },
            handler: (request, reply) => {

                const Donors = request.models().Donors;

                Donors.query().asCallback((donorErr, foundDonor) => {

                    if (donorErr){
                        return reply(Boom.wrap(donorErr));
                    }

                    if (!foundDonor){
                        return reply(Boom.notFound('No donors found'));
                    }
                    return reply(foundDonor);
                });
            }
        },
        // {
        //     method: 'DELETE',
        //     path: '/donors/{id}',
        //     config: {
        //         description: 'Delete a donor',
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
        //         const Donors = request.models().Donors;
        //         const id = request.params.id;
        //
        //         Donors.query().deleteById(id)
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
        //             return reply(Boom.notFound('Donor not found'));
        //         });
        //     }
        // }
    ];
};