const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./module/config');
const auth = require('./auth/jwt');
const cors = require('cors');

// Create Express Server
const app = express();

// Configuration
const PORT = 3001;
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

const internalOnlyUrls = [
    new RegExp('/user/invites/([A-Za-z0-9]+)/disable'),
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
            try {
                if (publicUrls.includes(req.originalUrl)) {
                    console.log('Public URL', req.originalUrl)
                    return;
                }
                if (internalOnlyUrls.some((url) => url.test(req.originalUrl))) {
                    throw Error('You can\'t access this URL from outside the network.');
                }
                const validate = auth(req);
                if (!validate) {
                    throw Error('You are not authorized to access this resource.');
                }
                proxyReq.setHeader('X-User', validate.user.username);
                proxyReq.setHeader('X-Email', validate.user.email);
                proxyReq.setHeader('X-UserId', validate.user._id);
            } catch (err) {
                return res.status(401).send({
                    success: false,
                    message: `You are not authorized to access this resource.`,
                    error: {
                        message: err.message,
                    }
                })
            }
        },
        onError: (err, req, res) => {
            return res.status(500).send({
                success: false,
                message: `Failed to process the request. Please contact the administrator, maybe the service is down.`,
                error: {
                    message: err.message,
                }
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
 