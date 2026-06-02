const express = require('express');
const orderRoutes = require('./routes/orderRoute');
const errorHandler =require('./middlewares/errorHandler')
const requestLogger = require('./middlewares/requestLogger');

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use('/api/v1/orders', orderRoutes);
app.use(errorHandler);

module.exports = app;