let paths = new Set(["/", "/2d", "/3d", "/easteregg"]);

exports.isAuthorizedRoute = (req) => {
    return (paths.has("/"+req.originalUrl.split("/")[1]));
};

