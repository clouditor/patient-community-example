const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/auth',
        createProxyMiddleware({
            target: 'http://auth-service:8080',
            changeOrigin: true,
        })
    );

    app.use(
        '/api/v1',
        createProxyMiddleware({
            target: 'http://nurse-api:8081',
            changeOrigin: true,
        })
    );
};