const {StatusCodes} = require('http-status-codes');

const notFound = (req, res) => {
    return res.status(StatusCodes.NOT_FOUND).send('<h1>NOT FOUND</h1>');
}

module.exports = notFound;