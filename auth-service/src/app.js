const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./module/config');
const auth = require('./auth');

mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const routes = require('./routes');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/auth', routes);
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode);
    res.json({
        success: false,
        message: 'Request has failed',
        error: {
            statusCode: statusCode,
            message: err.message,
        },
    });
})

app.listen(config.port, () => console.log('Auth service listening on port 1336!'));