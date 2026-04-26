const config = {
  projectName: 'efficiency-miniprogram',
  date: '2026-4-26',
  designWidth: 375,
  deviceRatio: {
    375: 1,
    640: 2,
    750: 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'vue3',
  plugins: [
    '@tarojs/plugin-framework-vue3',
    '@tarojs/plugin-platform-weapp',
  ],
  compiler: {
    type: 'webpack5',
  },
}

module.exports = config
