'use strict';

const Joi = require('joi');
const Boom = require('boom');
const CSV = require('csv');
const fs = require('fs');
const Items = require('items');
const Lev = require('fast-levenshtein');

const internals = {};

module.exports = (server, options) => {

    return [
        // - Donation CRUD -
        {
            method: 'GET',
            path: '/donations/{id}',
            config: {
                description: 'Get a specific donation',
                tags: ['api'],
                validate: {
                    params: {
                        id: Joi.any().required()
                    }
                },
                auth: false
            },
            handler: function (request, reply) {

                const Donations = request.models().Donations;

                Donations.query().findById(request.params.id).asCallback((donationErr, foundDonation) => {

                    if (donationErr) {
                        return reply(Boom.wrap(donationErr));
                    }
                    if (!foundDonation) {
                        return reply(Boom.notFound('Donation not found.'));
                    }

                    reply(foundDonation);
                });
            }
        },
        {
            method: 'GET',
            path: '/donations',
            config: {
                description: 'Get all donations',
                tags: ['api'],
                auth: false
            },
            handler: (request, reply) => {

                const Donations = request.models().Donations;

                Donations.query().asCallback((donationErr, foundDonation) => {

                    if (donationErr){
                        return reply(Boom.wrap(donationErr));
                    }

                    if (!foundDonation){
                        return reply(Boom.notFound('No donations found'));
                    }
                    return reply(foundDonation);
                });
            }
        },
        /*{
            method: 'GET',
            path: '/donations/populate',
            config: {
                description: 'Insert donations into DB',
                tags: ['api'],
                timeout: {
                    socket: false
                },
                auth: false
            },
            handler: (request, reply) => {

                const Donations = request.models().Donations;
                const Recipients = request.models().Recipients;
                const Donors = request.models().Donors;

                const LASTNAME = 3;
                const FIRSTNAME = 4;
                const MI = 5;
                const SUFFIX = 6;
                const ADDRESS1 = 7;
                const ADDRESS2 = 8;
                const CITY = 9;
                const STATE = 10;
                const ZIP = 11;
                const EMPLOYER = 21;
                const OCCUPATION = 22;
                const OCCUPATION_COMMENT = 23;
                const EMPLOYMENT_INFO_REQUESTED = 24;

                const parser = CSV.parse({delimiter: ','}, (parseErr, data) => {

                    if (parseErr) {
                        return reply(parseErr);
                    }

                    //for (let i = 1, len = data.length; i < len; i++) {

                    Items.serial(data, (donationLine, next) => {

                        const donorCriteria = {
                            firstName: (donationLine[FIRSTNAME] || null),
                            lastName: (donationLine[LASTNAME] || null),
                            address1: (donationLine[ADDRESS1] || null),
                            city: (donationLine[CITY] || null)
                        };

                        Donors.query().where(donorCriteria).asCallback((error, donor) => {

                            if (error){

                                return next(error);
                            }

                            if (donor && donor[0]) {
                                const donorId = donor[0].id;
                                //internals.insertDonation(donorId, donationLine, reply);
                                Donations.query().insert({
                                    id: (donationLine[12]  || null),
                                    amount: (donationLine[1] || null),
                                    receiptDate: (donationLine[2] || null),
                                    filedDate: (donationLine[13] || null),
                                    receiptType: (donationLine[14] || null),
                                    receiptSourceType: (donationLine[15] || null),
                                    amended: (donationLine[19] || null),
                                    recipientId: (donationLine[0] || null),
                                    donorId: donorId
                                }).asCallback((donationError, donation) => {

                                    if (donationError){
                                        return next(donationError);
                                    }
                                    return next();
                                });
                            }
                            else {
                                Donors.query().insert({
                                    firstName: (donationLine[FIRSTNAME] || null),
                                    lastName: (donationLine[LASTNAME] || null),
                                    middleInitial: (donationLine[MI] || null),
                                    suffix: (donationLine[SUFFIX] || null),
                                    address1: (donationLine[ADDRESS1] || null),
                                    address2: (donationLine[ADDRESS2] || null),
                                    city: (donationLine[CITY] || null),
                                    state: (donationLine[STATE] || null),
                                    zip: (donationLine[ZIP] || null),
                                    occupation: (donationLine[OCCUPATION] || null),
                                    occupationComment: (donationLine[OCCUPATION_COMMENT] || null),
                                    employmentInfoRequested: (donationLine[EMPLOYMENT_INFO_REQUESTED] || null),
                                    employer: (donationLine[EMPLOYER] || null)
                                })
                                .asCallback((error, donor) => {

                                    if (error){
                                        return next(error);
                                    }
                                    Donations.query().insert({
                                        id: (donationLine[12] || null),
                                        amount: (donationLine[1] || null),
                                        receiptDate: (donationLine[2] || null),
                                        filedDate: (donationLine[13] || null),
                                        receiptType: (donationLine[14] || null),
                                        receiptSourceType: (donationLine[15] || null),
                                        amended: (donationLine[19] || null),
                                        recipientId: (donationLine[0] || null),
                                        donorId: donor.id
                                    }).asCallback((donationError, donation) => {

                                        if (donationError){
                                            return next(donationError);
                                        }
                                        return next();
                                    });
                                });
                            }
                        });
                    //}
                    }, (itemsError) => {

                        if (itemsError) {
                            return reply(itemsError);
                        }
                        return reply('Bictory!');
                    });
                });
                fs.createReadStream('./contrib_out.csv').pipe(parser);
            }
        },
        {
            method: 'GET',
            path: '/donations/fixture',
            config: {
                description: 'Get all donations',
                tags: ['api'],
                auth: false,
                timeout: {
                    socket: false
                }
            },
            handler: (request, reply) => {

                const Donations = request.models().Donations;
                const Recipients = request.models().Recipients;
                const Donors = request.models().Donors;

                //const endResult = [];

                const LASTNAME = 3;
                const FIRSTNAME = 4;
                const MI = 5;
                const SUFFIX = 6;
                const ADDRESS1 = 7;
                const ADDRESS2 = 8;
                const CITY = 9;
                const STATE = 10;
                const ZIP = 11;
                const EMPLOYER = 21;
                const OCCUPATION = 22;
                const OCCUPATION_COMMENT = 23;


                const parser = CSV.parse({delimiter: ','}, (parseErr, data) => {

                    if (parseErr) {
                        return reply(parseErr);
                    }

                    for (let i = 1, len = data.length; i < len; i++) {

                        const donorString = data[i][LASTNAME] + data[i][FIRSTNAME] + data[i][ADDRESS1] + data[i][CITY];
                        const nextDonor = data[i+1];

                        if (nextDonor){

                            const nextDonorString = nextDonor[LASTNAME] + nextDonor[FIRSTNAME] + nextDonor[ADDRESS1] + nextDonor[CITY];
                            const stein = Lev.get(donorString, nextDonorString);

                            //if they're close enough make them the same same same
                            if (stein < 3) {

                                data[i+1][LASTNAME] = data[i][LASTNAME];
                                data[i+1][FIRSTNAME] = data[i][FIRSTNAME];
                                data[i+1][MI] = data[i][MI];
                                data[i+1][SUFFIX] = data[i][SUFFIX];
                                data[i+1][ADDRESS1] = data[i][ADDRESS1];
                                data[i+1][ADDRESS2] = data[i][ADDRESS2];
                                data[i+1][CITY] = data[i][CITY];
                                data[i+1][STATE] = data[i][STATE];
                                data[i+1][ZIP] = data[i][ZIP];
                                data[i+1][EMPLOYER] = data[i][EMPLOYER];
                                data[i+1][OCCUPATION] = data[i][OCCUPATION];
                                data[i+1][OCCUPATION_COMMENT] = data[i][OCCUPATION_COMMENT];
                            }
                        }
                    }
                    CSV.stringify(data, (stringErr, dataString) => {

                        if (stringErr) {
                            return reply(stringErr);
                        }

                        fs.writeFile('./contrib_out.csv', dataString, (err) => {

                            if (err) {
                                return reply(err);
                            }
                            return reply('success');
                        });
                    });
                });

                fs.createReadStream('./contrib.csv').pipe(parser);
            }
        },
        {
            method: 'POST',
            path: '/donations',
            config: {
                tags: ['api'],
                description: 'Register new donation',
                validate: {
                    payload: {
                        id: Joi.number(),
                        amount: Joi.number().precision(2),
                        receiptDate: Joi.date(),
                        filedDate: Joi.date(),
                        receiptType: Joi.string().allow(null),
                        receiptSourceType: Joi.string().allow(null),
                        amended: Joi.string().allow(null),
                        recipientId: Joi.number(),
                        donorId: Joi.number()
                    }
                },
                auth: false
            },
            handler: (request, reply) => {

                const Donations = request.models().Donations;
                const Payload = request.payload;

                Donations.query().insertAndFetch(Payload)
                .asCallback((error, donation) => {

                    if (error){
                        return reply(error);
                    }

                    return reply(donation);
                });
            }
        },
        {
            method: 'DELETE',
            path: '/donations/{id}',
            config: {
                description: 'Delete a donation',
                tags: ['api'],
                validate: {
                    params: {
                        id: Joi.number().integer().required()
                    }
                },
                auth: false
            },
            handler: (request, reply) => {

                const Donations = request.models().Donations;
                const id = request.params.id;

                Donations.query().deleteById(id)
                .asCallback((error, rowsDeleted) => {

                    if (error){
                        return reply(error);
                    }

                    if (rowsDeleted === 1) {
                        return reply().code(204);
                    }

                    return reply(Boom.notFound('Donation not found'));
                });
            }
        },*/
    ];
};
