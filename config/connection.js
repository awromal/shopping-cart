const MongoClient = require('mongodb').MongoClient;
const state = {
    db: null
};

module.exports.connect = function(done) {
    const url = "mongodb+srv://aromalsreekumar2006:jKaQFb0OHD7buENc@cluster0.y4bvzjb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const dbName = 'shopping'; // Your DB name

    MongoClient.connect(url,).then((client) => {
        state.db = client.db(dbName);
        done();
    }).catch((err) => {
        done(err);
    });
};

module.exports.get = function() {
    return state.db;
};
