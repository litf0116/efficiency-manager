<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">周报列表</h2>
      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出 Excel
      </el-button>
    </div>

    <div class="filter-bar">
      <el-select v-model="filter.warehouseId" placeholder="选择仓库" clearable @change="handleFilterChange">
        <el-option label="全部仓库" :value="0" />
        <el-option
          v-for="wh in warehouseList"
          :key="wh.id"
          :label="wh.name"
          :value="wh.id"
        />
      </el-select>

      <el-select v-model="filter.teamId" placeholder="选择小组" clearable @change="handleFilterChange">
        <el-option label="全部小组" :value="0" />
        <el-option
          v-for="team in teamList"
          :key="team.id"
          :label="team.name"
          :value="team.id"
        />
      </el-select>

      <el-date-picker
        v-model="filter.yearMonth"
        type="month"
        placeholder="选择月份"
        format="YYYY-MM"
        value-format="YYYY-MM"
        @change="handleFilterChange"
      />
    </div>

    <el-table :data="tableData" stripe v-loading="loading" show-summary>
      <el-table-column prop="team.name" label="小组" width="150" />
      <el-table-column prop="team.warehouse.name" label="仓库" width="120" />
      <el-table-column prop="year" label="年份" width="80" align="center" />
      <el-table-column prop="week" label="周次" width="80" align="center" />
      <el-table-column prop="totalHeadcount" label="总人数" width="80" align="center" />
      <el-table-column prop="formalWorkers" label="正式工" width="80" align="center" />
      <el-table-column prop="contractWorkers" label="劳务工" width="80" align="center" />
      <el-table-column prop="totalOutput" label="总产出" width="100" align="right">
        <template #default="{ row }">
          <span class="font-num">{{ row.totalOutput }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="efficiency" label="人效" width="100" align="center">
        <template #default="{ row }">
          <span class="font-num" :class="getEfficiencyClass(Number(row.efficiency))">
            {{ row.efficiency }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleViewDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <el-dialog v-model="detailVisible" title="周报详情" width="700px">
      <div v-if="currentReport" class="report-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="小组">{{ currentReport.team?.name }}</el-descriptions-item>
          <el-descriptions-item label="仓库">{{ currentReport.team?.warehouse?.name }}</el-descriptions-item>
          <el-descriptions-item label="年份">{{ currentReport.year }}年</el-descriptions-item>
          <el-descriptions-item label="周次">第{{ currentReport.week }}周</el-descriptions-item>
          <el-descriptions-item label="总人数">{{ currentReport.totalHeadcount }}</el-descriptions-item>
          <el-descriptions-item label="正式工">{{ currentReport.formalWorkers }}</el-descriptions-item>
          <el-descriptions-item label="劳务工">{{ currentReport.contractWorkers }}</el-descriptions-item>
          <el-descriptions-item label="人效">
            <span class="font-num" :class="getEfficiencyClass(Number(currentReport.efficiency))">
              {{ currentReport.efficiency }}
            </span>
          </el-descriptions-item>
        </el-descriptions>

        <h4 class="detail-title">产出明细</h4>
        <el-table :data="currentReport.details" size="small">
          <el-table-column prop="module" label="模块" width="100" />
          <el-table-column prop="operation" label="操作" />
          <el-table-column prop="unit" label="单位" width="80" align="center" />
          <el-table-column prop="quantity" label="数量" width="100" align="right">
            <template #default="{ row }">
              <span class="font-num">{{ row.quantity }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { reportApi } from '@/api/report'
import { teamApi } from '@/api/team'
import { warehouseApi } from '@/api/warehouse'

const loading = ref(false)
const detailVisible = ref(false)
const currentReport = ref<any>(null)

const tableData = ref<any[]>([])
const teamList = ref<any[]>([])
const warehouseList = ref<any[]>([])

const filter = reactive({
  warehouseId: 0,
  teamId: 0,
  yearMonth: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const getEfficiencyClass = (efficiency: number) => {
  if (efficiency >= 1.0) return 'text-success'
  if (efficiency >= 0.8) return 'text-warning'
  return 'text-danger'
}

const getStatusType = (status: string) => {
  switch (status) {
    case 'SUBMITTED': return 'warning'
    case 'APPROVED': return 'success'
    case 'REJECTED': return 'danger'
    default: return 'info'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'SUBMITTED': return '已提交'
    case 'APPROVED': return '已审核'
    case 'REJECTED': return '已驳回'
    default: return status
  }
}

const fetchTeams = async () => {
  const res = await teamApi.getAll()
  teamList.value = res
}

const fetchWarehouses = async () => {
  const res = await warehouseApi.getAll()
  warehouseList.value = res
}

const fetchData = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    if (filter.warehouseId) params.warehouseId = filter.warehouseId
    if (filter.teamId) params.teamId = filter.teamId
    if (filter.yearMonth) {
      const [year, month] = filter.yearMonth.split('-')
      params.year = Number(year)
      params.month = Number(month)
    }

    const res = await reportApi.getAll(params)
    tableData.value = res
    pagination.total = res.length
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleFilterChange = () => {
  pagination.page = 1
  fetchData()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchData()
}

const handleViewDetail = (row: any) => {
  currentReport.value = row
  detailVisible.value = true
}

const handleExport = async () => {
  try {
    const params: any = {}
    if (filter.warehouseId) params.warehouseId = filter.warehouseId
    if (filter.yearMonth) {
      const [year, month] = filter.yearMonth.split('-')
      params.year = Number(year)
      params.month = Number(month)
    }

    const blob = await reportApi.exportExcel(params)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `周报数据_${filter.yearMonth || new Date().getFullYear()}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('导出失败')
  }
}

onMounted(() => {
  fetchData()
  fetchTeams()
  fetchWarehouses()
})
</script>

<style lang="scss" scoped>
.page-container {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.report-detail {
  .detail-title {
    margin: 16px 0 8px;
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
