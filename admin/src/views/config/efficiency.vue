<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">标准人效配置</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增配置
      </el-button>
    </div>

    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column prop="module" label="模块" width="120">
        <template #default="{ row }">
          <el-tag type="info" size="small">{{ getModuleText(row.module) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作名称" />
      <el-table-column prop="unit" label="单位" width="120" />
      <el-table-column prop="stdRate" label="标准人效" width="120" align="right">
        <template #default="{ row }">
          <span class="font-num">{{ row.stdRate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="说明" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="模块" prop="module">
          <el-select v-model="form.module" placeholder="请选择模块">
            <el-option label="入库" value="inbound" />
            <el-option label="出库" value="outbound" />
            <el-option label="上架" value="shelve" />
            <el-option label="质检" value="qc" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作名称" prop="operation">
          <el-input v-model="form.operation" placeholder="如: 新品入库" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="如: 件/人/天" />
        </el-form-item>
        <el-form-item label="标准人效" prop="stdRate">
          <el-input v-model="form.stdRate" placeholder="如: 4000" />
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="备注说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { configApi, type StdEfficiency } from '@/api/config'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增配置')
const isEdit = ref(false)

const tableData = ref<StdEfficiency[]>([])

const formRef = ref()
const form = reactive({
  id: 0,
  module: '',
  operation: '',
  unit: '',
  stdRate: '',
  description: '',
  status: 1
})

const rules = {
  module: [{ required: true, message: '请选择模块', trigger: 'change' }],
  operation: [{ required: true, message: '请输入操作名称', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
  stdRate: [{ required: true, message: '请输入标准人效', trigger: 'blur' }]
}

const moduleMap: Record<string, string> = {
  inbound: '入库',
  outbound: '出库',
  shelve: '上架',
  qc: '质检'
}

const getModuleText = (module: string) => moduleMap[module] || module

const fetchData = async () => {
  loading.value = true
  try {
    const res = await configApi.getStdEfficiency()
    tableData.value = res
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增配置'
  isEdit.value = false
  Object.assign(form, { id: 0, module: '', operation: '', unit: '', stdRate: '', description: '', status: 1 })
  dialogVisible.value = true
}

const handleEdit = (row: StdEfficiency) => {
  dialogTitle.value = '编辑配置'
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    module: row.module,
    operation: row.operation,
    unit: row.unit,
    stdRate: row.stdRate,
    description: row.description,
    status: row.status
  })
  dialogVisible.value = true
}

const handleStatusChange = async (row: StdEfficiency) => {
  try {
    await configApi.updateStdEfficiency(row.id, { status: row.status })
    ElMessage.success('状态更新成功')
  } catch (error) {
    row.status = row.status === 1 ? 0 : 1
    console.error(error)
  }
}

const handleDelete = async (row: StdEfficiency) => {
  try {
    await ElMessageBox.confirm(`确定删除配置 "${row.operation}" 吗?`, '提示', {
      type: 'warning'
    })
    await configApi.deleteStdEfficiency(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value) {
      await configApi.updateStdEfficiency(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await configApi.createStdEfficiency(form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.page-container {
  max-width: 1200px;
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
</style>
