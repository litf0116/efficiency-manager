<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">小组管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增小组
      </el-button>
    </div>

    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="name" label="小组名称" />
      <el-table-column prop="warehouse.name" label="所属仓库" />
      <el-table-column prop="floor" label="楼层" width="100" />
      <el-table-column prop="function" label="职能" width="120" />
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
        <el-form-item label="所属仓库" prop="warehouseId">
          <el-select v-model="form.warehouseId" placeholder="请选择仓库">
            <el-option
              v-for="wh in warehouseList"
              :key="wh.id"
              :label="wh.name"
              :value="wh.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="小组名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入小组名称" />
        </el-form-item>
        <el-form-item label="楼层" prop="floor">
          <el-input v-model="form.floor" placeholder="如: 1楼、2楼" />
        </el-form-item>
        <el-form-item label="职能" prop="function">
          <el-select v-model="form.function" placeholder="请选择职能">
            <el-option label="仓储" value="仓储" />
            <el-option label="收货" value="收货" />
            <el-option label="上架" value="上架" />
            <el-option label="质检" value="质检" />
            <el-option label="出库" value="出库" />
          </el-select>
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
import { teamApi, type Team } from '@/api/team'
import { warehouseApi } from '@/api/warehouse'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增小组')
const isEdit = ref(false)

const tableData = ref<Team[]>([])
const warehouseList = ref<any[]>([])

const formRef = ref()
const form = reactive({
  id: 0,
  warehouseId: 0,
  name: '',
  floor: '',
  function: '',
  status: 1
})

const rules = {
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  name: [{ required: true, message: '请输入小组名称', trigger: 'blur' }],
  function: [{ required: true, message: '请选择职能', trigger: 'change' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const [teamRes, whRes] = await Promise.all([
      teamApi.getAll(),
      warehouseApi.getAll()
    ])
    tableData.value = teamRes
    warehouseList.value = whRes
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增小组'
  isEdit.value = false
  Object.assign(form, { id: 0, warehouseId: 0, name: '', floor: '', function: '', status: 1 })
  dialogVisible.value = true
}

const handleEdit = (row: Team) => {
  dialogTitle.value = '编辑小组'
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    warehouseId: row.warehouseId,
    name: row.name,
    floor: row.floor,
    function: row.function,
    status: row.status
  })
  dialogVisible.value = true
}

const handleDelete = async (row: Team) => {
  try {
    await ElMessageBox.confirm(`确定删除小组 "${row.name}" 吗?`, '提示', {
      type: 'warning'
    })
    await teamApi.delete(row.id)
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
      await teamApi.update(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await teamApi.create(form)
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
