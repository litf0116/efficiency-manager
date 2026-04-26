/**
 * 图表渲染模块
 * 使用 Chart.js
 */

const Charts = {
  // 配色方案
  colors: [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8c6d', '#a5a5a5'
  ],

  // 图表实例存储
  instances: {},

  // 销毁所有图表
  destroyAll() {
    Object.values(this.instances).forEach(chart => chart.destroy());
    this.instances = {};
  },

  // 渲染趋势图（折线图）
  renderTrendChart(canvasId, logs) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // 销毁旧图表
    if (this.instances[canvasId]) {
      this.instances[canvasId].destroy();
    }

    // 按小组分组
    const teamData = {};
    logs.forEach(log => {
      if (!teamData[log.teamName]) {
        teamData[log.teamName] = { labels: [], data: [] };
      }
      const monthLabel = `${log.month}月`;
      if (!teamData[log.teamName].labels.includes(monthLabel)) {
        teamData[log.teamName].labels.push(monthLabel);
        teamData[log.teamName].data.push(log.efficiency);
      }
    });

    // 构建数据集
    const datasets = Object.entries(teamData).map(([name, values], index) => ({
      name,
      data: values.data,
      borderColor: this.colors[index % this.colors.length],
      backgroundColor: this.colors[index % this.colors.length] + '20',
      tension: 0.3
    }));

    // 合并所有标签
    const allLabels = [...new Set(datasets.flatMap(d => {
      const baseLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'];
      return baseLabels.slice(0, Math.max(...datasets.map(d => d.data.length)));
    }))].sort((a, b) => parseInt(a) - parseInt(b));

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: datasets.map(d => ({
          label: d.name,
          data: d.data,
          borderColor: d.borderColor,
          backgroundColor: d.backgroundColor,
          tension: d.tension,
          fill: false
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { usePointStyle: true }
          },
          title: {
            display: true,
            text: '各小组人效趋势 (2025年)'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 0.5,
            title: { display: true, text: '人效指数' }
          }
        }
      }
    });

    this.instances[canvasId] = chart;
    return chart;
  },

  // 渲染排名图（水平柱状图）
  renderRankingChart(canvasId, logs, month) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // 销毁旧图表
    if (this.instances[canvasId]) {
      this.instances[canvasId].destroy();
    }

    // 筛选指定月份数据
    const monthLogs = logs.filter(log => log.month === month);

    // 按人效排序
    monthLogs.sort((a, b) => b.efficiency - a.efficiency);

    const labels = monthLogs.map(l => l.teamName);
    const data = monthLogs.map(l => l.efficiency);
    const colors = data.map(v => {
      if (v >= 1.3) return '#73c0de';  // 优秀
      if (v >= 1.0) return '#91cc75';   // 达标
      if (v >= 0.9) return '#fac858';   // 警告
      return '#ee6666';                   // 不达标
    });

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: '人效指数',
          data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `${month}月各小组人效排名`
          },
          tooltip: {
            callbacks: {
              label: (context) => `人效: ${context.raw.toFixed(3)}`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 2.0,
            title: { display: true, text: '人效指数' }
          }
        }
      }
    });

    this.instances[canvasId] = chart;
    return chart;
  },

  // 渲染目标对比图
  renderTargetComparison(canvasId, logs, month, target) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.instances[canvasId]) {
      this.instances[canvasId].destroy();
    }

    const monthLogs = logs.filter(log => log.month === month);
    monthLogs.sort((a, b) => b.efficiency - a.efficiency);

    const labels = monthLogs.map(l => l.teamName);
    const data = monthLogs.map(l => l.efficiency);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '实际人效',
            data,
            backgroundColor: data.map(v => v >= target ? '#91cc75' : '#ee6666'),
            borderColor: data.map(v => v >= target ? '#91cc75' : '#ee6666'),
            borderWidth: 1
          },
          {
            label: '目标',
            data: labels.map(() => target),
            type: 'line',
            borderColor: '#5470c6',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: `${month}月人效 vs 目标 (${target})`
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 2.0,
            title: { display: true, text: '人效指数' }
          }
        }
      }
    });

    this.instances[canvasId] = chart;
    return chart;
  }
};

// 导出
window.Charts = Charts;
