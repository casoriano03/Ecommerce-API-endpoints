const jwt = require('jsonwebtoken');

function isAuth2(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
	if(token) {
		const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET );
		req.UserId = decodedToken.id,
		req.Username = decodedToken.Username
		next();	
	} else {
		res.status(403).json({"statusCode":403, "result":"You are not authorized for this transaction. Please login or signup."})
	}	
}

module.exports = isAuth2;