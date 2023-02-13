module.exports = {
    compiler: {
        type: 'webpack5',
        // 仅 webpack5 支持依赖预编译配置
        prebundle: {
            enable: true,
            esbuild: {
                logOverride: { 'this-is-undefined-in-esm': 'silent' },
            },
        },
    },
    env: {
        NODE_ENV: '"development"',
    },
    defineConstants: {
    },
    mini: {},
    h5: {},
};
