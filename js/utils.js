/**
 * 工具函数
 */

const Utils = {
  // 格式化数字
  formatNumber(num, decimals = 2) {
    if (num === null || num === undefined) return '-';
    return Number(num).toFixed(decimals);
  },

  // 格式化日期
  formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  // 计算平均值
  average(arr) {
    if (!arr || arr.length === 0) return 0;
    const sum = arr.reduce((a, b) => a + b, 0);
    return sum / arr.length;
  },

  // 计算达标率
  calculatePassRate(logs, target = 1.0) {
    if (!logs || logs.length === 0) return 0;
    const passed = logs.filter(l => l.efficiency >= target).length;
    return (passed / logs.length) * 100;
  },

  // 获取月份名称
  getMonthName(month) {
    const names = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return names[month] || `${month}月`;
  },

  // 防抖函数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // 生成UUID
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  // 深拷贝
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  // 导出为CSV
  exportToCSV(data, headers, filename = 'export.csv') {
    const headerRow = headers.join(',');
    const rows = data.map(row =>
      headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        const str = String(val);
        // 转义逗号和引号
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',')
    );

    const csv = [headerRow, ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  },

  // 显示提示消息
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // 动画
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // 确认对话框
  confirm(message) {
    return new Promise(resolve => {
      const result = window.confirm(message);
      resolve(result);
    });
  }
};

// 导出
window.Utils = Utils;
