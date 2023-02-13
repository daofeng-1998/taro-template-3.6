module.exports = {
    compiler: {
        type: 'webpack5',
        // 仅 webpack5 支持依赖预编译配置
        prebundle: {
            enable: false,
            esbuild: {
                logOverride: { 'this-is-undefined-in-esm': 'silent' },
            },
        },
    },
    env: {
        NODE_ENV: '"production"',
    },
    defineConstants: {
    },
    mini: {},
    h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
    },
};
