const Setting = require('./src/setting.env');
const CompressionPlugin = require('compression-webpack-plugin')
// 拼接路径
const resolve = dir => require('path').join(__dirname, dir);
// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version;
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss');

// 生产环境

// let cdn = { css: [], js: [] };
const isDev = process.env.NODE_ENV === 'production'; // 判断是否是开发环境
// let externals = {};
// CDN外链，会插入到index.html中

// if (isDev) {
//     // 如果是非开发环境 就排除打包 否则不排除
//     externals = {
//         // key(包名) / value(这个值 是 需要在CDN中获取js, 相当于 获取的js中 的该包的全局的对象的名字)
//         'vue': 'Vue',
//         'vuex': 'Vuex',
//         'vue-router': 'VueRouter',
//         'axios': 'axios'
//     }
//     cdn = {
//         js: isDev ? [
//             'https://v5cdn1.snd02.com/static/js/crypt.min.js',
//             'https://v5cdn2.snd02.com/static/js/vue.min.js',
//             'https://v5cdn3.snd02.com/static/js/vuex.min.js',
//             'https://v5cdn1.snd02.com/static/js/axios.min.js',
//             'https://v5cdn2.snd02.com/static/js/vue-router.min.js',
//             'https://v5cdn3.snd02.com/static/js/config.js'
//         ] : [
//             'https://v5cdn1.sndtest.com/static/js/crypt.min.js',
//             'https://v5cdn1.sndtest.com/static/js/vue.min.js',
//             'https://v5cdn1.sndtest.com/static/js/vuex.min.js',
//             'https://v5cdn1.sndtest.com/static/js/axios.min.js',
//             'https://v5cdn1.sndtest.com/static/js/vue-router.min.js',
//             'https://v5cdn1.sndtest.com/static/js/config.js'
//         ]
//     }
// }

module.exports = {
    publicPath: Setting.publicPath,
    lintOnSave: Setting.lintOnSave,
    outputDir: Setting.outputDir,
    assetsDir: Setting.assetsDir,
    runtimeCompiler: true,
    productionSourceMap: false,

    devServer: {
        // host: 'sndtest.cn',
        // port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        proxy: {
            '.*\\.as$': {
                // target: 'http://localhost:8081', // 本地环境
                target: 'http://120.76.211.142:8081', // 测试环境
                // target: 'http://192.168.1.135:8081', // 测试环境
                // ws: true,
                changeOrigin: true
                // pathRewrite: {
                //     '^/api': ''
                // }
            }
        }
    },
    css: {
        loaderOptions: {
            less: {

            }
        }

    },
    // configureWebpack: config => {
    //     // 排除打包的某些选项
    //     if (isDev) {
    //         config.externals = externals
    //     }
    // },
    // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/@vue/cli-service/lib/config/base.js
    chainWebpack: config => {
        // 环境修改配置
        // 开启图片压缩
        if (isDev) {
            config.module
                .rule('images')
                .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
                .use('image-webpack-loader')
                .loader('image-webpack-loader')
                .options({ bypassOnDebug: true });

            // 开启js、css压缩
            config.plugin('compressionPlugin').use(
                new CompressionPlugin({
                    algorithm: 'gzip', // 使用gzip压缩
                    test: /\.js$|\.html$|\.css/, // 匹配文件名
                    filename: '[path].gz[query]', // 压缩后的文件名(保持原文件名，后缀加.gz)
                    minRatio: 0.8, // 压缩率小于1才会压缩
                    threshold: 10240, // 对超过10k的数据压缩
                    deleteOriginalAssets: false // 不删除源文件
                })
            );
            // config.when(process.env.NODE_ENV === 'production', config => {
            //     config.plugin('html').tap((arg) => {
            //         arg[0].cdn = cdn
            //         return arg
            //     })
            // });
        }

        /**
         * 删除懒加载模块的 prefetch preload，降低带宽压力
         * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
         * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
         * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
         */
        config.plugins
            .delete('prefetch')
            .delete('preload');
        // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
        config.resolve
            .symlinks(true);
        config
            // 开发环境
            .when(process.env.NODE_ENV === 'development',
                  // sourcemap不包含列信息
                  config => config.devtool('cheap-source-map')
            )
            // 非开发环境
            .when(process.env.NODE_ENV !== 'development', config => {

        });
        // 不编译 iView Pro
        config.module
            .rule('js')
            .test(/\.jsx?$/)
            .exclude
            .add(resolve('src/libs/iview-pro'))
            .end();
        // 使用 iView Loader
        config.module
            .rule('vue')
            .test(/\.vue$/)
            .use('iview-loader')
            .loader('iview-loader')
            .tap(() => {
                return Setting.iviewLoaderOptions
            })
            .end();
        // markdown
        config.module
            .rule('md')
            .test(/\.md$/)
            .use('text-loader')
            .loader('text-loader')
            .end();
        // i18n
        config.module
            .rule('i18n')
            .resourceQuery(/blockType=i18n/)
            .use('i18n')
            .loader('@kazupon/vue-i18n-loader')
            .end();
        // image exclude
        const imagesRule = config.module.rule('images');
        imagesRule
            .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
            .exclude
            .add(resolve('src/assets/svg'))
            .end();
        // 重新设置 alias
        config.resolve.alias
            .set('@api', resolve('src/api'));
        // node
        config.node
            .set('__dirname', true)
            .set('__filename', true);
    }
}
