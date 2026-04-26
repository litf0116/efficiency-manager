<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">仓库管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增仓库
      </el-button>
    </div>

    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="name" label="仓库名称" />
      <el-table-column prop="location" label="位置" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
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
        <el-form-item label="仓库名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="form.location" placeholder="如: 浙江省海宁市" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
import { warehouseApi, type Warehouse } from '@/api/warehouse'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增仓库')
const isEdit = ref(false)

const tableData = ref<Warehouse[]>([])

const formRef = ref()
const form = reactive({
  id: 0,
  name: '',
  location: '',
  status: 1
})

const rules = {
  name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
  location: [{ required: true, message: '请输入位置', trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await warehouseApi.getAll()
    tableData.value = res
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增仓库'
  isEdit.value = false
  Object.assign(form, { id: 0, name: '', location: '', status: 1 })
  dialogVisible.value = true
}

const handleEdit = (row: Warehouse) => {
  dialogTitle.value = '编辑仓库'
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    name: row.name,
    location: row.location,
    status: row.status
  })
  dialogVisible.value = true
}

const handleDelete = async (row: Warehouse) => {
  try {
    await ElMessageBox.confirm(`确定删除仓库 "${row.name}" 吗?`, '提示', {
      type: 'warning'
    })
    await warehouseApi.delete(row.id)
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
      await warehouseApi.update(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await warehouseApi.create(form)
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
