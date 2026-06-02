const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
    logger.error({
        requestId: req.requestId,
        errorCode: err.errorCode,
        message: err.message,
        stack: err.stack
    });
    return res.status(err.statusCode || 500).json({
        success: false,
        errorCode: err.errorCode || 'INTERNAL_SERVER_ERROR',
        message: err.message || 'Something went wrong'
    });
};