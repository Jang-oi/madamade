const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        createProxyMiddleware('v1/keywords', {
            target      : 'https://smartstore.naver.com',
            changeOrigin: true,
            ws          : true,
            pathRewrite : {'^/v1/keywords': ''}
        }),
    );
    app.use(
        createProxyMiddleware('v1/products', {
            target      : 'https://openapi.naver.com/v1/search/shop.json',
            changeOrigin: true,
            ws          : true,
            pathRewrite : {'^/v1/products': ''}
        }),
    );
};