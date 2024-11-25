const jwt = require('jsonwebtoken');

function isAuth(req, res, next) {
	const token = req.cookies.auth_token;
	if(token) {
		jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
            if (err) {
                return res.status(403).json({"statusCode": 403, "result": "Invalid token. Please login again."});
            }
            req.UserId = decodedToken.id;
            req.Username = decodedToken.Username;
            next();
        });
	} else {
		res.status(403).json({"statusCode":403, "result":"You are not authorized for this transaction. Please login or signup."})
	}	
}

module.exports = isAuth;