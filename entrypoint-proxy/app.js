const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

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

// Logging
app.use(morgan('dev'));

// Proxy endpoints
Object.keys(pathToService).forEach((serviceName) => {
    app.use(serviceName, createProxyMiddleware({
        target: pathToService[serviceName],
        changeOrigin: true,
        xfwd: true,
        onProxyReq: (proxyReq, req, res) => {
            console.log('Headers:', req.headers.authorization);
            if (!req.headers.authorization) {
                return;
            }

            const [type, token] = req.headers.authorization.split(' ');

            if (type !== 'Bearer') {
                return;
            }
            
            proxyReq.setHeader('X-User', 'zabogdan');
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
 