 function isAdmin(req, res, next) {
    if (req.Username === 'Admin') {
        next();
    } else {
        res.status(403).json({"statusCode": 403, "message": "You are not authorized. Please contact Admin" });
    }
}

module.exports = isAdmin;
