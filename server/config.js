'use strict';

let Creds = {};
try {
    Creds = require('./credentials');
}
catch (ignoreException){
    Creds = require('./credentials-sample');
}

const knexTest = {
    client: 'sqlite3',
    connection: {
        filename: ':memory:'
    },
    useNullAsDefault: true
};

const knexLive = {
    client: 'mysql',
    connection: {
        host      : 'localhost',
        user      : Creds.mysqlCreds.user,
        password  : Creds.mysqlCreds.password,
        database  : 'political_money'
    },
    useNullAsDefault: true,
    debug: true
};

module.exports = {

    server: {
        host: '0.0.0.0',
        port: process.env.PORT || 5055
    },

    main: {
        connection: 'schwifty',
        secrets: {
            jwtSecret: Creds.secrets.jwtSecret
        }
    },

    schwifty: {
        knex: process.env.NODE_ENV === 'test' ? knexTest : knexLive
    }
};
