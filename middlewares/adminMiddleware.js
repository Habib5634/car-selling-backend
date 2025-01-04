const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ success: false, message: "Authorization token missing" });
        }

        JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token",
                });
            } else if (decode.userType !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: "Access forbidden: Not an admin",
                });
            } else {
                req.user = decode;
                next();
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error validating token",
            error,
        });
    }
};
