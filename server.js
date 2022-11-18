const { port, env } = require('./conf/vars');

const moment = require('moment');

const app = require("./conf/express");
const mongo = require("./conf/mongo");

const routerUtils = require("./utils/routerUtils");

const dimensionalTwo = require("./router/dimensionalTwo");
const dimensionalThree = require("./router/dimensionalThree");

mongo.connect();

let BLACKLIST =["178.20.55.18"];

app.all("*", function (req, res, next) {
    try {
        let ipAddress = req.ipInfo.ip.slice(0, 7) == "::ffff:" ? req.ipInfo.ip.slice(7) : req.ipInfo.ip;
        if (!BLACKLIST.includes(ipAddress)) {
            if (!routerUtils.isAuthorizedRoute(req)) {
                req.statusCode = 400;
                throw new Error("Route does not exist");
            } else {
                console.log("🎯 Request received from " + ipAddress + " at " + moment().format("YYYY-MM-DD HH:mm:ss") + " for " + req.method + " " + req.originalUrl);
                next();
            }
        } else {
            req.statusCode = 403;
            throw new Error(ipAddress + " IP is not in whiteList");
        }
    } catch (error) {
        next(error);

    }
});


app.get("/", (req, res) => {
    res.status(200).json({
        "success": true,
        "data": {
            "message": "Welcome to the API"
        }
    });
});

app.get("/easteregg", (req, res) => {
    res.status(418).json({
        "success": true,
        "data": {
            "message": "You found the easter egg!"
        }
    });
});

app.use("/2d", dimensionalTwo);
app.use("/3d", dimensionalThree);

app.use((error, req, res, next) => {
    res.status(req.statusCode || 500).json({
        "success": false,
        "data": {
            "message": error.toString()
        }
    });
});

app.listen(port, () => {
    console.log(`🤖 Application running in: ${env}`)
    console.log(`🛡  Blacklisted ip(s): ${BLACKLIST}`);
    console.log(`✅ Example app listening at http://localhost:${port}`);
});
