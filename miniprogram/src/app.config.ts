const config = {
  pages: [
    'pages/team-select/index',
    'pages/index/index',
    'pages/report/index',
    'pages/history/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2563EB',
    navigationBarTitleText: '人效管理',
    navigationBarTextStyle: 'white',
  },
  tabBar: {
    color: '#64748B',
    selectedColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/home.png',
        selectedIconPath: 'assets/home-active.png',
      },
      {
        pagePath: 'pages/report/index',
        text: '上报',
        iconPath: 'assets/report.png',
        selectedIconPath: 'assets/report-active.png',
      },
      {
        pagePath: 'pages/history/index',
        text: '历史',
        iconPath: 'assets/history.png',
        selectedIconPath: 'assets/history-active.png',
      },
    ],
  },
}

export default config
