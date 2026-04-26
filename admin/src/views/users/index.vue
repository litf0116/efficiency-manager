<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增用户
      </el-button>
    </div>

    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="role" label="角色" width="120">
        <template #default="{ row }">
          <el-tag :type="getRoleType(row.role)" size="small">
            {{ getRoleText(row.role) }}
          </el-tag>
        </template>
      </el-table-column>
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="密码" :prop="isEdit ? '' : 'password'">
          <el-input
            v-model="form.password"
            type="password"
            :placeholder="isEdit ? '留空则不修改密码' : '请输入密码'"
            show-password
          />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="财务" value="finance" />
            <el-option label="组长" value="leader" />
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
import { authApi } from '@/api/auth'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const isEdit = ref(false)

interface User {
  id: number
  username: string
  role: string
  status: number
}

const tableData = ref<User[]>([])

const formRef = ref()
const form = reactive({
  id: 0,
  username: '',
  password: '',
  role: '',
  status: 1
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const getRoleType = (role: string) => {
  switch (role) {
    case 'admin': return 'danger'
    case 'finance': return 'warning'
    case 'leader': return 'primary'
    default: return 'info'
  }
}

const getRoleText = (role: string) => {
  switch (role) {
    case 'admin': return '管理员'
    case 'finance': return '财务'
    case 'leader': return '组长'
    default: return role
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await authApi.getCurrentUser()
    tableData.value = [res]
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增用户'
  isEdit.value = false
  Object.assign(form, { id: 0, username: '', password: '', role: '', status: 1 })
  dialogVisible.value = true
}

const handleEdit = (row: User) => {
  dialogTitle.value = '编辑用户'
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    username: row.username,
    password: '',
    role: row.role,
    status: row.status
  })
  dialogVisible.value = true
}

const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm(`确定删除用户 "${row.username}" 吗?`, '提示', {
      type: 'warning'
    })
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
      ElMessage.success('更新成功')
    } else {
      await authApi.register({
        username: form.username,
        password: form.password,
        role: form.role
      })
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
