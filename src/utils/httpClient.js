const axios = require('axios');

const client = axios.create({
    timeout: process.env.COURIER_TIMEOUT || 10000
});

module.exports = client;