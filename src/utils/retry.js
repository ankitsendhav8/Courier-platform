const logger = require('./logger');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff(fn, retries = process.env.RETRY_COUNT || 3, delay = process.env.RETRY_DELAY || 1000) {
    try {
        logger.warn({
            message: 'Retrying courier API',
            retriesRemaining: retries
        });
        return await fn();
    } catch (error) {
        const status = error.response?.status;
        const shouldRetry = !status || status >= 500 || error.code === 'ECONNABORTED';
        if (!shouldRetry || retries <= 0) {
            throw error;
        }
        await sleep(delay);
        return retryWithBackoff(fn, retries - 1, delay * 2);
    }
}

module.exports = { retryWithBackoff };