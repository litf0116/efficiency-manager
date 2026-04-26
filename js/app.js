/**
 * 人效管理系统主应用
 */

const App = {
  currentTab: 'dashboard',
  initialized: false,

  init() {
    if (this.initialized) return;
    Storage.initDefaults();
    this.bindEvents();
    this.switchTab('dashboard');
    this.initialized = true;
  },

  bindEvents() {
    document.querySelectorAll('.nav-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    document.getElementById('file-input').addEventListener('change', (e) => {
      this.handleFileImport(e.target.files[0]);
    });

    document.querySelector('.drop-zone').addEventListener('dragover', (e) => {
      e.preventDefault();
      e.currentTarget.classList.add('drag-over');
    });

    document.querySelector('.drop-zone').addEventListener('dragleave', (e) => {
      e.currentTarget.classList.remove('drag-over');
    });

    document.querySelector('.drop-zone').addEventListener('drop', (e) => {
      e.preventDefault();
      e.currentTarget.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) this.handleFileImport(file);
    });

    document.getElementById('save-settings-btn').addEventListener('click', () => {
      this.saveSettings();
    });

    document.getElementById('export-btn').addEventListener('click', () => {
      this.exportData();
    });

    document.getElementById('clear-data-btn').addEventListener('click', async () => {
      if (await Utils.confirm('确定要清空所有数据吗？此操作不可恢复。')) {
        Storage.clear();
        Storage.initDefaults();
        this.refreshDashboard();
        Utils.showToast('数据已清空', 'success');
      }
    });
  },

  switchTab(tab) {
    this.currentTab = tab;

    document.querySelectorAll('.nav-tabs .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tab}`);
    });

    if (tab === 'dashboard') {
      this.refreshDashboard();
    } else if (tab === 'manage') {
      this.refreshManageTab();
    } else if (tab === 'settings') {
      this.loadSettings();
    }
  },

  async handleFileImport(file) {
    if (!file) return;

    const statusEl = document.getElementById('import-status');
    statusEl.textContent = '正在解析...';
    statusEl.className = 'import-status info';

    try {
      const result = await Parser.parseExcel(await file.arrayBuffer());

      if (!result.success) {
        throw new Error(result.error);
      }

      const effSheet = Parser.identifyEfficiencySheet(result.data);
      if (!effSheet) {
        throw new Error('无法识别人效数据sheet');
      }

      const logs = Parser.parseEfficiencyData(effSheet.data);

      if (logs.length === 0) {
        throw new Error('未能解析出人效数据');
      }

      const importResult = Parser.importEfficiencyData(logs);

      statusEl.textContent = `导入成功！新增 ${importResult.imported} 条，跳过 ${importResult.skipped} 条重复记录`;
      statusEl.className = 'import-status success';

      Utils.showToast(`成功导入 ${importResult.imported} 条人效数据`, 'success');

      if (this.currentTab === 'dashboard') {
        this.refreshDashboard();
      }
    } catch (error) {
      statusEl.textContent = `导入失败: ${error.message}`;
      statusEl.className = 'import-status error';
      Utils.showToast(`导入失败: ${error.message}`, 'error');
    }
  },

  refreshDashboard() {
    const logs = Storage.getEfficiencyLogs();
    const settings = Storage.getSettings();
    const teams = Storage.getTeams();
    const target = settings.efficiencyTarget || 1.0;

    this.updateStatCards(logs, teams, target);
    Charts.renderTrendChart('trend-chart', logs);

    const latestMonth = this.getLatestMonth(logs);
    if (latestMonth) {
      Charts.renderRankingChart('ranking-chart', logs, latestMonth);
    }

    this.renderLogTable(logs);
  },

  updateStatCards(logs, teams, target) {
    const teamCount = new Set(logs.map(l => l.teamName)).size;
    const avgEfficiency = Utils.average(logs.map(l => l.efficiency));
    const passRate = Utils.calculatePassRate(logs, target);
    const lowCount = logs.filter(l => l.efficiency < target).length;

    document.getElementById('stat-teams').textContent = teamCount;
    document.getElementById('stat-avg').textContent = Utils.formatNumber(avgEfficiency, 3);
    document.getElementById('stat-pass').textContent = `${Utils.formatNumber(passRate, 1)}%`;
    document.getElementById('stat-alert').textContent = lowCount;

    document.getElementById('stat-alert').className = lowCount > 0 ? 'stat-value alert' : 'stat-value';
  },

  getLatestMonth(logs) {
    if (!logs || logs.length === 0) return null;
    const months = logs.map(l => l.month);
    return Math.max(...months);
  },

  renderLogTable(logs) {
    const tbody = document.getElementById('log-table-body');
    const settings = Storage.getSettings();
    const target = settings.efficiencyTarget || 1.0;

    if (!logs || logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">暂无数据，请先导入Excel</td></tr>';
      return;
    }

    logs.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      if (a.month !== b.month) return b.month - a.month;
      return b.efficiency - a.efficiency;
    });

    tbody.innerHTML = logs.slice(0, 50).map(log => {
      const status = log.efficiency >= target ? 'pass' : (log.efficiency >= target * 0.9 ? 'warning' : 'fail');
      return `
        <tr class="${status}">
          <td>${log.teamName}</td>
          <td>${log.year}年${log.month}月</td>
          <td>${Utils.formatNumber(log.efficiency, 3)}</td>
          <td>${target}</td>
          <td><span class="status-badge ${status}">${status === 'pass' ? '达标' : status === 'warning' ? '警告' : '不达标'}</span></td>
        </tr>
      `;
    }).join('');
  },

  refreshManageTab() {
    this.renderManageTable('teams', Storage.getTeams(), [
      { key: 'name', label: '小组名称' },
      { key: 'warehouseId', label: '仓库', render: (v) => Storage.getWarehouses().find(w => w.id === v)?.name || '-' },
      { key: 'floor', label: '楼层' },
      { key: 'function', label: '职能' }
    ]);
  },

  renderManageTable(type, data, columns) {
    const container = document.getElementById('manage-table-container');

    const html = `
      <div class="manage-header">
        <h3>${type === 'teams' ? '小组' : type === 'warehouses' ? '仓库' : '标准人效'}</h3>
        <button class="btn btn-primary" onclick="App.showAddModal('${type}')">+ 新增</button>
      </div>
      <table class="data-table">
        <thead>
          <tr>${columns.map(c => `<th>${c.label}</th>`).join('')}<th>操作</th></tr>
        </thead>
        <tbody>
          ${data.length === 0 ? `<tr><td colspan="${columns.length + 1}" class="empty">暂无数据</td></tr>` :
            data.map(item => `
              <tr>
                ${columns.map(c => `<td>${c.render ? c.render(item[c.key]) : (item[c.key] || '-')}</td>`).join('')}
                <td>
                  <button class="btn-icon" onclick="App.editItem('${type}', '${item.id}')" title="编辑">✏️</button>
                  <button class="btn-icon" onclick="App.deleteItem('${type}', '${item.id}')" title="删除">🗑️</button>
                </td>
              </tr>
            `).join('')}
        </tbody>
      </table>
    `;

    container.innerHTML = html;
  },

  showAddModal(type) {
    const modal = document.getElementById('modal');
    const content = modal.querySelector('.modal-content');

    if (type === 'teams') {
      content.innerHTML = `
        <h3>新增小组</h3>
        <form id="add-form">
          <div class="form-group">
            <label>小组名称</label>
            <input type="text" name="name" required>
          </div>
          <div class="form-group">
            <label>所属仓库</label>
            <select name="warehouseId" required>
              ${Storage.getWarehouses().map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>楼层</label>
            <input type="text" name="floor" placeholder="如：2楼">
          </div>
          <div class="form-group">
            <label>职能</label>
            <select name="function" required>
              <option value="收货">收货</option>
              <option value="仓储">仓储</option>
              <option value="质检">质检</option>
              <option value="入库">入库</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="App.closeModal()">取消</button>
            <button type="submit" class="btn btn-primary">保存</button>
          </div>
        </form>
      `;

      document.getElementById('add-form').addEventListener('submit', (e) => {
        e.preventDefault();
        this.addTeam(new FormData(e.target));
      });
    }

    modal.classList.add('show');
  },

  addTeam(formData) {
    const teams = Storage.getTeams();
    const newTeam = {
      id: Date.now(),
      name: formData.get('name'),
      warehouseId: parseInt(formData.get('warehouseId')),
      floor: formData.get('floor'),
      function: formData.get('function')
    };
    teams.push(newTeam);
    Storage.saveTeams(teams);
    this.closeModal();
    this.refreshManageTab();
    Utils.showToast('小组已添加', 'success');
  },

  editItem(type, id) {
    Utils.showToast('编辑功能开发中', 'info');
  },

  async deleteItem(type, id) {
    if (!await Utils.confirm('确定要删除吗？')) return;

    if (type === 'teams') {
      const teams = Storage.getTeams().filter(t => t.id != id);
      Storage.saveTeams(teams);
      this.refreshManageTab();
      Utils.showToast('已删除', 'success');
    }
  },

  closeModal() {
    document.getElementById('modal').classList.remove('show');
  },

  loadSettings() {
    const settings = Storage.getSettings();
    document.getElementById('target-efficiency').value = settings.efficiencyTarget || 1.0;
    document.getElementById('low-threshold').value = settings.lowEfficiencyThreshold || 0.9;
    document.getElementById('high-threshold').value = settings.highEfficiencyThreshold || 1.5;
  },

  saveSettings() {
    const settings = {
      efficiencyTarget: parseFloat(document.getElementById('target-efficiency').value) || 1.0,
      lowEfficiencyThreshold: parseFloat(document.getElementById('low-threshold').value) || 0.9,
      highEfficiencyThreshold: parseFloat(document.getElementById('high-threshold').value) || 1.5
    };
    Storage.saveSettings(settings);
    Utils.showToast('设置已保存', 'success');
    this.refreshDashboard();
  },

  exportData() {
    const logs = Storage.getEfficiencyLogs();
    if (logs.length === 0) {
      Utils.showToast('暂无数据可导出', 'warning');
      return;
    }

    const headers = ['teamName', 'year', 'month', 'efficiency'];
    const data = logs.map(l => ({
      teamName: l.teamName,
      year: l.year,
      month: `${l.month}月`,
      efficiency: l.efficiency.toFixed(3)
    }));

    Utils.exportToCSV(data, headers, `人效数据_${new Date().toISOString().slice(0,10)}.csv`);
    Utils.showToast('导出成功', 'success');
  }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
