const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load environment variables

const state = {
    db: null
};

module.exports.connect = function(done) {
    const url = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;

    MongoClient.connect(url).then((client) => {
        state.db = client.db(dbName);
        done();
    }).catch((err) => {
        done(err);
    });
};

module.exports.get = function() {
    return state.db;
};

