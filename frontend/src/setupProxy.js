const { createProxyMiddleware } = require('http-proxy-middleware');

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
};