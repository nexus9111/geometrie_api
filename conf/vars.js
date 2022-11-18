require("dotenv-safe").config();

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.NODE_ENV == "production" ? process.env.PORT_PROD : process.env.PORT_DEV,
    mongoose_uri: process.env.NODE_ENV == "production" ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI_DEV
} 