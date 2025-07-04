import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({error: 'Authorization header is missing'});

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({error: 'Invalid token'});
    }
}