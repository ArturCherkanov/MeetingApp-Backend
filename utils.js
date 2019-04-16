const crypto = require('crypto');

const hash = (password) =>(
    crypto.createHmac('sha256', password)
        .update(process.env.userUPDATE)
        .digest('hex')
  )


module.exports = hash;
