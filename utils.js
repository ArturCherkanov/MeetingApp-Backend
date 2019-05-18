const crypto = require('crypto');

const hash = (password) =>(
    crypto.createHmac('sha256', process.env.userUPDATE)
        .update(password)
        .digest('hex')
);


module.exports = hash;
