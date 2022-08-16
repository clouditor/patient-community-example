const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
var bodyParser = require('body-parser')

module.exports = function (app) {
    app.use(
        '/auth',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
        })
    );

    app.use(
        '/api/v1/diseases',
        createProxyMiddleware({
            target: 'http://localhost:8086',
            changeOrigin: true,
        })
    );

    app.use(
        '/api/v1/groups',
        createProxyMiddleware({
            target: 'http://localhost:8081',
            changeOrigin: true,
        })
    );

    app.use(
        '/api/v1/users',
        createProxyMiddleware({
            target: 'http://localhost:8081',
            changeOrigin: true,
        })
    );

    app.use(
        '/api/v1/groupdata',
        createProxyMiddleware({
            target: 'http://127.0.0.1:8085',
            changeOrigin: true,
        })    
    );

    app.use(
        '/api/v1/data',
        createProxyMiddleware({
            target: 'http://127.0.0.1:8083',
            changeOrigin: true,
            onProxyReq: fixRequestBody,
        })
    );
};