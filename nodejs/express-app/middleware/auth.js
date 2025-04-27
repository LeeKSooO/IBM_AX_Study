const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';

const auth = (req, res, next) => {
    const header = req.headers.authorization;

    // for debugging
    //console.log('Authorization Header:', req.headers.authorization);


    if(!header) return res.status(401).json({message: '토큰 없음'});

    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: '유효하지 않은 토큰' });
    }
};

module.exports = auth;