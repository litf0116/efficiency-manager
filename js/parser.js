/**
 * Excel 解析器
 * 使用 SheetJS (xlsx.js)
 */

const Parser = {
  // 解析Excel文件
  async parseExcel(arrayBuffer) {
    try {
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });

      const results = {};

      // 遍历所有sheet
      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        results[sheetName] = this.processSheetData(jsonData);
      });

      return { success: true, data: results };
    } catch (error) {
      console.error('Excel parse error:', error);
      return { success: false, error: error.message };
    }
  },

  // 处理单个sheet数据
  processSheetData(rows) {
    if (!rows || rows.length === 0) return { headers: [], data: [] };

    // 第一行为表头
    const headers = rows[0].map(h => String(h).trim());
    const data = rows.slice(1).filter(row => row.some(cell => cell !== ''));

    return { headers, data };
  },

  // 识别人效数据sheet
  identifyEfficiencySheet(sheets) {
    // 查找包含"人效"关键字的sheet
    for (const [name, sheetData] of Object.entries(sheets)) {
      const headerStr = sheetData.headers.join('').toLowerCase();
      if (headerStr.includes('人效') || headerStr.includes('组别') || headerStr.includes('平均')) {
        return { name, data: sheetData };
      }
    }

    // 默认返回第一个有数据的sheet
    for (const [name, sheetData] of Object.entries(sheets)) {
      if (sheetData.data.length > 0) {
        return { name, data: sheetData };
      }
    }

    return null;
  },

  // 解析人效数据
  parseEfficiencyData(sheetData) {
    const { headers, data } = sheetData;
    const logs = [];

    // 找到月份对应的列索引
    const monthIndexMap = {};
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'];

    headers.forEach((header, index) => {
      monthNames.forEach(month => {
        if (header.includes(month)) {
          monthIndexMap[month] = index;
        }
      });
    });

    // 解析每一行数据
    data.forEach(row => {
      // 跳过空行或标题行
      const teamName = String(row[1] || '').trim();
      if (!teamName || teamName.includes('组别') || teamName.includes('平均')) {
        return;
      }

      // 跳过仓库名称行（如"海宁仓"）
      if (teamName === '海宁仓' || teamName === '临平仓') {
        return;
      }

      // 解析每月数据
      monthNames.forEach(month => {
        const colIndex = monthIndexMap[month];
        if (colIndex !== undefined) {
          const efficiency = parseFloat(row[colIndex]);
          if (!isNaN(efficiency) && efficiency > 0) {
            logs.push({
              id: this.generateId(),
              teamName: teamName,
              year: 2025,
              month: parseInt(month),
              efficiency: efficiency,
              totalOutput: null,
              stdOutput: null,
              headcount: null
            });
          }
        }
      });
    });

    return logs;
  },

  // 生成唯一ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  },

  // 导入数据到存储
  importEfficiencyData(logs) {
    const existingLogs = Storage.getEfficiencyLogs();
    const existingTeamNames = new Set(existingLogs.map(l => `${l.teamName}-${l.year}-${l.month}`));

    // 过滤掉已存在的记录
    const newLogs = logs.filter(log => {
      const key = `${log.teamName}-${log.year}-${log.month}`;
      return !existingTeamNames.has(key);
    });

    // 合并并保存
    const mergedLogs = [...existingLogs, ...newLogs];
    Storage.saveEfficiencyLogs(mergedLogs);

    return { imported: newLogs.length, skipped: logs.length - newLogs.length };
  }
};

// 导出
window.Parser = Parser;
