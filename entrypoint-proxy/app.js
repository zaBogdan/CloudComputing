const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./module/config');
const auth = require('./auth/jwt');
const cors = require('cors');

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "127.0.0.1";
const pathToService = {
    '/auth': 'http://127.0.0.1:1336',
    '/user': 'http://127.0.0.1:1337/',
    '/jobs': 'http://127.0.0.1:1338/',
    '/workers': 'http://127.0.0.1:1339/',
}

const publicUrls = [
    '/auth/login',
    '/auth/register',
]

// Logging
app.use(cors({
    origin: '*',
}))
app.use(morgan('dev'));

// Proxy endpoints
Object.keys(pathToService).forEach((serviceName) => {
    app.use(serviceName, createProxyMiddleware({
        target: pathToService[serviceName],
        changeOrigin: true,
        xfwd: true,
        onProxyReq: (proxyReq, req, res) => {
            if (publicUrls.includes(req.originalUrl)) {
                console.log('Public URL', req.originalUrl)
                return;
            }
            const validate = auth(req);
            proxyReq.setHeader('X-User', validate.user.username);
            proxyReq.setHeader('X-Email', validate.user.email);
            proxyReq.setHeader('X-UserId', validate.user._id);
        },
        onError: (err, req, res) => {
            return res.status(500).send({
                success: false,
                message: `Failed to process the request. Please contact the administrator, maybe the service is down.`,
            })
        }
    }));
});

app.use((req, res, next) => {
    res.status(404).send({
        success: false,
        message: `Couldn\'t find route: ${req.method} ${req.originalUrl}.`
    })
})

 // Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
 });
 