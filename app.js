const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const AppError = require('./utils/appError');
const ErrorMiddleware = require('./middlewares/error');

const app = express();

//parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// allow other request to get access
app.use(cors());

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/hotelManager', require('./routes/hotelManagerRoutes'));
app.use('/api/v1/traveller', require('./routes/travellerRoutes'));
app.all('*', (req, res, next) => {
    next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});

app.use(ErrorMiddleware);

module.exports = app;
