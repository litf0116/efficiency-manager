/**
 * localStorage 数据存储封装
 */

const Storage = {
  // 键名常量
  KEYS: {
    WAREHOUSES: 'eff_warehouses',
    TEAMS: 'eff_teams',
    CUSTOMERS: 'eff_customers',
    STD_RATES: 'eff_std_rates',
    EFFICIENCY_LOGS: 'eff_logs',
    SETTINGS: 'eff_settings'
  },

  // 获取数据
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Storage.get error for ${key}:`, e);
      return null;
    }
  },

  // 设置数据
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Storage.set error for ${key}:`, e);
      return false;
    }
  },

  // 删除数据
  remove(key) {
    localStorage.removeItem(key);
  },

  // 清空所有数据
  clear() {
    Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
  },

  // 初始化默认数据
  initDefaults() {
    // 仓库数据
    if (!this.get(this.KEYS.WAREHOUSES)) {
      this.set(this.KEYS.WAREHOUSES, [
        { id: 1, name: '海宁仓', location: '海宁' },
        { id: 2, name: '临平仓', location: '临平' }
      ]);
    }

    // 小组数据
    if (!this.get(this.KEYS.TEAMS)) {
      this.set(this.KEYS.TEAMS, [
        { id: 1, warehouseId: 1, name: '收货组', floor: '', function: '收货' },
        { id: 2, warehouseId: 1, name: '仓储一部-2楼', floor: '2楼', function: '仓储' },
        { id: 3, warehouseId: 1, name: '仓储一部-3楼', floor: '3楼', function: '仓储' },
        { id: 4, warehouseId: 1, name: '仓储一部-4楼', floor: '4楼', function: '仓储' },
        { id: 5, warehouseId: 1, name: '仓储一部-5楼', floor: '5楼', function: '仓储' },
        { id: 6, warehouseId: 1, name: '仓储二部', floor: '', function: '仓储' },
        { id: 7, warehouseId: 1, name: '品管部-4楼', floor: '4楼', function: '质检' },
        { id: 8, warehouseId: 1, name: '品管部-2楼', floor: '2楼', function: '质检' },
        { id: 9, warehouseId: 1, name: '品管部-6楼', floor: '6楼', function: '质检' },
        { id: 10, warehouseId: 2, name: '入库组', floor: '', function: '入库' },
        { id: 11, warehouseId: 2, name: '仓储一部', floor: '', function: '仓储' },
        { id: 12, warehouseId: 2, name: '仓储二部-3楼', floor: '3楼', function: '仓储' },
        { id: 13, warehouseId: 2, name: '收货组', floor: '', function: '收货' },
        { id: 14, warehouseId: 2, name: '质检', floor: '', function: '质检' }
      ]);
    }

    // 标准人效
    if (!this.get(this.KEYS.STD_RATES)) {
      this.set(this.KEYS.STD_RATES, [
        { id: 1, operation: '新品入库', unit: '件/人/天', stdRate: 4000 },
        { id: 2, operation: 'B2C退货拆包', unit: '件/人/天', stdRate: 800 },
        { id: 3, operation: 'B2C出库(拣配包装)', unit: '件/人/天', stdRate: 450 },
        { id: 4, operation: 'B2B/JIT出库', unit: '件/人/天', stdRate: 1000 },
        { id: 5, operation: '新品上架', unit: '件/人/天', stdRate: 2000 },
        { id: 6, operation: '退货上架', unit: '件/人/天', stdRate: 1000 }
      ]);
    }

    // 设置
    if (!this.get(this.KEYS.SETTINGS)) {
      this.set(this.KEYS.SETTINGS, {
        efficiencyTarget: 1.0,  // 目标人效
        lowEfficiencyThreshold: 0.9,  // 低效阈值
        highEfficiencyThreshold: 1.5   // 高效阈值
      });
    }

    // 人效日志（初始为空）
    if (!this.get(this.KEYS.EFFICIENCY_LOGS)) {
      this.set(this.KEYS.EFFICIENCY_LOGS, []);
    }
  },

  // 获取所有仓库
  getWarehouses() {
    return this.get(this.KEYS.WAREHOUSES) || [];
  },

  // 保存仓库
  saveWarehouses(warehouses) {
    return this.set(this.KEYS.WAREHOUSES, warehouses);
  },

  // 获取所有小组
  getTeams() {
    return this.get(this.KEYS.TEAMS) || [];
  },

  // 保存小组
  saveTeams(teams) {
    return this.set(this.KEYS.TEAMS, teams);
  },

  // 获取人效日志
  getEfficiencyLogs() {
    return this.get(this.KEYS.EFFICIENCY_LOGS) || [];
  },

  // 保存人效日志
  saveEfficiencyLogs(logs) {
    return this.set(this.KEYS.EFFICIENCY_LOGS, logs);
  },

  // 获取标准人效
  getStdRates() {
    return this.get(this.KEYS.STD_RATES) || [];
  },

  // 保存标准人效
  saveStdRates(rates) {
    return this.set(this.KEYS.STD_RATES, rates);
  },

  // 获取设置
  getSettings() {
    return this.get(this.KEYS.SETTINGS) || {};
  },

  // 保存设置
  saveSettings(settings) {
    return this.set(this.KEYS.SETTINGS, settings);
  }
};

// 导出
window.Storage = Storage;
