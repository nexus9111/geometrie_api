exports.displayPoint = (point) => {
    safePoint = {
        "x": point.x,
        "y": point.y,
    }
    if (point.z) {
        safePoint.z = point.z;
    }
    safePoint.name = point.name;
    return safePoint;
}