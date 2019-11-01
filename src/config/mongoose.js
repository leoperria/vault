const mongoose = require("mongoose");
const {mongo, env} = require("./vars");

// Init Mongoose
mongoose.Promise = Promise;
if (env === "development") {
    mongoose.set("debug", false);
}
mongoose.connection.on("error", (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
    mongoose.connect(mongo.uri, {
        useCreateIndex: true,
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    return mongoose.connection;
};
