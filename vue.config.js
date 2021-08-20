module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://127.0.0.1:8090/',
                changeOrigin:true,
                pathRewrite:{
                    '/api':'/api'
                }
            },
            '/middledata':{
                target:'http://127.0.0.1:8081/',
                changeOrigin:true,
                pathRewrite:{
                    '/middledata':'/middledata'
                }
            }
        }
    },
    configureWebpack: {
        devtool: 'source-map'
      }
}