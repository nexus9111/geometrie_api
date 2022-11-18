const Point = require("../models/dimensionalThreePoint");
const { v4: uuidv4 } = require('uuid');
const securityUtils = require('../utils/securityUtils')

const HATEOAS_PARAMS = {
    CREATE: {
        href: "/api/3d",
        method: "POST",
    },
    LIST: {
        href: "/api/3d",
        method: "GET",
    },
    EDIT: {
        method: "PUT",
        href: "/api/3d/point/:name"
    },
    GET: {
        "href": "/3d/points/:name",
        "method": "GET"
    },
    DELETE: {
        "href": "/3d/points/:name",
        "method": "DELETE"
    },
    DISTANCE: {
        "href": "/3d/points/distance",
        "method": "GET"
    }
}

const HATEOAS = {
    "create": HATEOAS_PARAMS.CREATE,
    "list": HATEOAS_PARAMS.LIST,
    "edit": HATEOAS_PARAMS.EDIT,
    "get": HATEOAS_PARAMS.GET,
    "delete": HATEOAS_PARAMS.DELETE,
    "distance": HATEOAS_PARAMS.DISTANCE
}

exports.create = async (req, res, next) => {
    try {
        if (!req.body.hasOwnProperty("x") || !req.body.hasOwnProperty("y") || !req.body.hasOwnProperty("z") ) {
            req.statusCode = 400;
            throw new Error("Missing required fields");
        }

        if (isNaN(req.body.x) || isNaN(req.body.y) || isNaN(req.body.z)) {
            req.statusCode = 400;
            throw new Error("Invalid data type");
        }

        if (req.body.x < 0 || req.body.x > 1000000 || req.body.y < 0 || req.body.y > 1000000 || req.body.z < 0 || req.body.z > 1000000) {
            req.statusCode = 400;
            throw new Error("Coordinates must be between 0 and 1000000");
        }

        if (req.body.name) {
            if (req.body.name.length > 100) {
                req.statusCode = 400;
                throw new Error("Name must be less than 100 characters"); 
            }
            let pointExists = await Point.findOne({name: req.body.name});
            if (pointExists) {
                req.statusCode = 403;
                throw new Error("Point with this name already exists");
            }
        }

        let newPoint = new Point({
            x: req.body.x,
            y: req.body.y,
            z: req.body.z,
            name: req.body.name || uuidv4()
        });

        await newPoint.save();

        return res.status(201).json({
            "success": true,
            "data": {
                "message": "Point created successfully",
                "point": securityUtils.displayPoint(newPoint)
            },
            "_links": HATEOAS
        });
    } catch (error) {
        next(error);
    }
}


exports.list = async (req, res, next) => {
    try {
        let points = await Point.find();
        res.status(200).json({
            "success": true,
            "data": {
                "message": "Points listed successfully",
                "points": points.map(point => securityUtils.displayPoint(point))
            },
            "_links": HATEOAS
        });
    } catch (error) {
        next(error);
    }
}

exports.getOne = async (req, res, next) => {
    try {
        let point = await Point.findOne({name: req.params.name});
        if (!point) {
            req.statusCode = 404;
            throw new Error("Point not found");
        }

        return res.status(200).json({
            "success": true,
            "data": {
                "message": "Points listed successfully",
                "points": securityUtils.displayPoint(point)
            },
            "_links": HATEOAS
        });
    } catch (error) {
        next(error);
    }
}

exports.update = async (req, res, next) => {
    try {
        if (req.body.hasOwnProperty("x") && isNaN(req.body.x) && (req.body.x < 0 || req.body.x > 1000000)) {
            req.statusCode = 400;
            throw new Error("Invalid data type for x");
        }  

        if (req.body.hasOwnProperty("y") && isNaN(req.body.y) && (req.body.y < 0 || req.body.y > 1000000)) {
            req.statusCode = 400;
            throw new Error("Invalid data type for y");
        }

        if (req.body.hasOwnProperty("z") && isNaN(req.body.z) && (req.body.z < 0 || req.body.z > 1000000)) {
            req.statusCode = 400;
            throw new Error("Invalid data type for y");
        }

        if (req.body.hasOwnProperty("name")) {
            if (req.body.name.length > 100) {
                req.statusCode = 400;
                throw new Error("Name must be less than 100 characters"); 
            }
            let pointExists = await Point.findOne({name: req.body.name});
            if (pointExists) {
                req.statusCode = 403;
                throw new Error("Point with this name already exists");
            }
        }
       
        let point = await Point.findOne({name: req.params.name});
        if (!point) {
            req.statusCode = 404;
            throw new Error("Point not found");
        }

        point.name = req.body.name || point.name;
        point.x = req.body.x || point.x;
        point.y = req.body.y || point.y;
        point.z = req.body.z || point.z;

        await point.save();

        return res.status(200).json({
            "success": true,
            "data": {
                "message": "Point updated successfully",
                "point": securityUtils.displayPoint(point)
            },
            "_links": HATEOAS
        });
    } catch (error) {
        next(error);
    }
}

exports.delete = async (req, res, next) => {
    try {
        let point = await Point.findOne({name: req.params.name});
        if (!point) {
            return res.status(200).json({
                "success": true,
                "data": {
                    "message": "Point deleted successfully"
                }
            });
        }

        await point.remove();

        return res.status(200).json({
            "success": true,
            "data": {
                "message": "Point deleted successfully"
            },
            "_links": HATEOAS
        });
    } catch (error) {
        next(error);
    }
}

exports.distance = async (req, res, next) => {
    try {
        if (!req.query.points || req.query.points.length != 2) {
            req.statusCode = 400;
            throw new Error("Missing required fields");
        }
        let point1 = await Point.findOne({name: req.query.points[0]});
        if (!point1) {
            req.statusCode = 404;
            throw new Error("Point 1 not found");
        }

        let point2 = await Point.findOne({name: req.query.points[1]});
        if (!point2) {
            req.statusCode = 404;
            throw new Error("Point 2 not found");
        }

        let distance = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2) + Math.pow(point1.z - point2.z, 2));

        return res.status(200).json({
            "success": true,
            "data": {
                "message": "Distance calculated successfully",
                "distance": distance
            },
            "_links": HATEOAS
        });
    } catch (error) {
        next(error);
    }
}