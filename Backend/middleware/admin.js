const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization; 
    if (!token) {
        return res.status(401).json({
            message: "Missing Authorization header"
        });
    }
    try { 
        const words = token.split(" ");
        const jwtToken = words[1];

        const decodedValue = jwt.verify(jwtToken, JWT_ADMIN_PASSWORD);

        if (decodedValue.id) {
            req.userId = decodedValue.id; 
            next();
        } else {
            res.status(403).json({
                message: "You are not authenticated"
            });
        }
    } catch(e) {
        res.status(401).json({
            message: "Incorrect or expired token"
        });
    }
}

module.exports = {
    adminMiddleware: adminMiddleware
}