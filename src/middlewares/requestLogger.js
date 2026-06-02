const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
    req.requestId = uuidv4();
    logger.info({
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        body: req.body
    });
    next();
};