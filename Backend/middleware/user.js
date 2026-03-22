const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config"); 

function userMiddleware(req, res, next) {
    const token = req.headers.authorization; 
    
    if (!token) {
        return res.status(401).json({
            message: "Missing Authorization header"
        });
    }

    try { 
        const words = token.split(" ");
        const jwtToken = words[1];

        // 2. Use JWT_USER_PASSWORD here
        const decodedValue = jwt.verify(jwtToken, JWT_USER_PASSWORD);

        // 3. Check for 'id' instead of 'username' because that's what we signed it with
        if (decodedValue.id) {
            req.userId = decodedValue.id; // 4. Attach as req.userId so the /purchases route can find it
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
    userMiddleware: userMiddleware
}