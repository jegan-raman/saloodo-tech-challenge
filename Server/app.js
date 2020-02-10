const config = require('./config/config.json');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const httpStatus  = require('http-status');

var app = express();

app.use(bodyParser.json());
app.use(cors());
const routerConst = require('./routes/index.route');
app.use('/api',routerConst);

app.listen(config.PORT,() => {
    console.log("server started in the port " + config.PORT); 
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new APIError('API not found', httpStatus.NOT_FOUND);
	return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
    const errorStatus = err.status ? err.status: httpStatus.INTERNAL_SERVER_ERROR
	return res.status(errorStatus).json({
		success: false,
		message: err.isPublic ? err.message : ((errorStatus && httpStatus[errorStatus]) ? httpStatus[err.status] : httpStatus.INTERNAL_SERVER_ERROR),
		stack: err.stack,
	})
});