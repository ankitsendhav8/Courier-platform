const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
    logger.error({
        requestId: req.requestId,
        errorCode: err.errorCode,
        message: err.message,
        stack: err.stack
    });
    if (err.errorCode === 'DUPLICATE_ORDER') {
        return res.status(409).json({
            success: false,
            errorCode: err.errorCode,
            message: 'Order already exists'
        });
    } else {
        return res.status(err.statusCode || 500).json({
            success: false,
            errorCode: err.errorCode || 'INTERNAL_SERVER_ERROR',
            message: err.message || 'Something went wrong'
        });
    }
};