const jwt = require('jsonwebtoken');


const checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token&&token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (token) {
        jwt.verify(token, process.env.secret, (err, decoded) => {
            if (err) {
                return res.status(400).end();
            }
            req.decoded = decoded;
            next();
        });
    }else{
        return res.status(400).end();
    }
};

module.exports = {
    checkToken: checkToken,
};
