import Jwt from "jsonwebtoken";

export const generateAuthToken = (user) => {
    const jwtSecretKey = 't9rXw5bF2mS7zQ8p';
    const token = Jwt.sign({ _id: user._id, name: user.name, email: user.email, role: "user" }, jwtSecretKey);
    return token;
};

export const adminToken = (data) => {
    const jwtSecretKey = 't9rXw5bF2mS7zQ8p';
    const token = Jwt.sign({ email: data.email, role: "admin" }, jwtSecretKey);
    return token;
};

export const Authentication = (req, res, next) => {
    const jwtSecretKey = 't9rXw5bF2mS7zQ8p';
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(400).json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: "Token is missing" });
    }

    try {
        const tokens = Jwt.verify(token, jwtSecretKey);
        if (tokens.role === "user") {
            req.user = tokens;
            return next();
        } else {
            return res.status(403).json({ message: "Access denied. User role is not allowed." });
        }
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed. Invalid token." });
    }
};



