const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const pathToService = {
    '/user': 'http://127.0.0.1:1337/',
    '/jobs': 'http://127.0.0.1:1338/',
    '/workers': 'http://127.0.0.1:1339/'
}

// Logging
app.use(morgan('dev'));

// Proxy endpoints
Object.keys(pathToService).forEach((serviceName) => {
    app.use(serviceName, createProxyMiddleware({
        target: pathToService[serviceName],
        changeOrigin: true,
        onError: (err, req, res) => {
            return res.status(500).send({
                success: false,
                message: `Failed to process the request. Please contact the administrator, maybe the service is down.`,
            })
        }
    }));
});

 // Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
 });
 