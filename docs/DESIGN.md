# 仓储人效管理系统 - 设计文档

## 文档信息

| 项目 | 内容 |
|---|---|
| 版本 | v1.0 |
| 日期 | 2025-04-25 |
| 状态 | 设计阶段 |

---

## 一、系统定位

### 1.1 核心价值

| 现状 | 改进后 |
|---|---|
| 组长填Excel日报表 | H5移动端快速上报 |
| 财务手动汇总数据 | 系统自动汇总计算 |
| 老板看Excel文件 | Web后台实时查看 |
| 数据分散难追溯 | 数据库集中存储 |

### 1.2 替代范围

```
组长(H5上报) → 系统收集 → 老板(直接看)
                              ├── Web后台
                              └── 定期推送(可选)
```

---

## 二、用户角色

| 角色 | 使用端 | 核心功能 |
|---|---|---|
| 组长 | H5 | 数据上报、查看本组历史 |
| 财务/管理员 | Web后台 | 数据审核、导出、配置 |
| 老板 | Web后台 | 数据查看、分析 |

---

## 三、数据流程

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  组长(H5)                      Web后台                         │
│  ───────                       ────────                        │
│  1. 选择周次                   数据概览                         │
│  2. 填写出勤人数               趋势分析                         │
│  3. 填写各模块数量             排名展示                         │
│  4. 提交                       数据管理                         │
│      ↓                          ↑                             │
│      └──── 系统自动计算人效 ────┘                             │
│                                                               │
│  月度汇总 ← 四周数据自动汇总                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 四、H5上报表单设计

### 4.1 基础信息（自动填充）

```
小组名称: [仓储二部一组]  (登录后自动)
周次: [2025年第25周]     (选择)
日期: [2025-06-16]      (自动)
```

### 4.2 出勤信息

```
总出勤人数: [  ] 人
├── 正式工: [  ] 人
└── 劳务工: [  ] 人
```

### 4.3 入库模块

| 类目 | 单位 | 数量 |
|---|---|---|
| 新品入库-春夏 | 件 | [    ] |
| 新品入库-配饰 | 件 | [    ] |
| 退货入库 | 件 | [    ] |

> 入库人效: [自动计算]  (标准:入库总量/标准人效)

### 4.4 出库模块

| 类目 | 单位 | 数量 |
|---|---|---|
| B2C出库-成衣 | 单 | [    ] |
| B2C出库-配饰 | 单 | [    ] |
| B2B出库 | 件 | [    ] |

> 出库人效: [自动计算]

### 4.5 上架模块

| 类目 | 单位 | 数量 |
|---|---|---|
| 新品上架-服 | 件 | [    ] |
| 新品上架-配 | 件 | [    ] |
| 退货上架 | 件 | [    ] |

> 上架人效: [自动计算]

### 4.6 质检模块（如适用）

| 类目 | 单位 | 数量 |
|---|---|---|
| 退货质检包装 | 件 | [    ] |
| 新品质检包装 | 件 | [    ] |
| ... | | |

### 4.7 汇总显示（实时计算）

```
┌─────────────────────────────────────┐
│  当日人效: 1.308  ✓ 达标           │
│  (总产出 / 标准产出)                 │
└─────────────────────────────────────┘
          [ 提交上报 ]
```

---

## 五、Web后台功能

### 5.1 数据概览

- 本周上报进度 (12/20组已上报)
- 本周整体人效
- 本周 vs 上周 对比
- 达标率
- 不达标小组预警
- 近4周趋势图

### 5.2 数据管理

- 所有人效数据列表
  - 按仓库/小组筛选
  - 按时间范围筛选
  - 明细钻取
- 月度汇总视图
- 导出Excel
- 数据补录

### 5.3 小组管理

- 小组增删改
- 绑定仓库/楼层
- 职能配置
- 启用/禁用

### 5.4 系统设置

- 标准人效配置
- 达标阈值设置
- 仓库配置
- 用户管理

---

## 六、标准人效参考表

| 业务动作 | 标准人效 | 单位 |
|---|---|---|
| B2C退货拆包 | 800 | 件/人/天 |
| B2C出库(拣配包装) | 450 | 件/人/天 |
| B2B/JIT出库 | 1000 | 件/人/天 |
| 新品入库 | 4000 | 件/人/天 |
| 新品上架 | 2000 | 件/人/天 |
| 退货上架 | 1000 | 件/人/天 |

---

## 七、数据库设计

### 7.1 核心表结构

```sql
-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'finance', 'leader') NOT NULL,
    team_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 仓库表
CREATE TABLE warehouse (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(100)
);

-- 小组表
CREATE TABLE team (
    id INT PRIMARY KEY AUTO_INCREMENT,
    warehouse_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    floor VARCHAR(20),
    function VARCHAR(50),
    status TINYINT DEFAULT 1,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
);

-- 周报数据表
CREATE TABLE weekly_report (
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    year INT NOT NULL,
    week INT NOT NULL,
    report_date DATE NOT NULL,
    total_headcount INT DEFAULT 0,
    formal_workers INT DEFAULT 0,
    contract_workers INT DEFAULT 0,
    status ENUM('submitted', 'approved', 'rejected') DEFAULT 'submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES team(id),
    UNIQUE KEY unique_team_week (team_id, year, week)
);

-- 周报明细表
CREATE TABLE weekly_report_detail (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id INT NOT NULL,
    module VARCHAR(50) NOT NULL,  -- 'inbound', 'outbound', 'shelve', 'qc'
    operation VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    quantity DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (report_id) REFERENCES weekly_report(id)
);

-- 标准人效配置表
CREATE TABLE std_efficiency (
    id INT PRIMARY KEY AUTO_INCREMENT,
    operation VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    std_rate DECIMAL(10,2) NOT NULL COMMENT '件/人/天',
    module VARCHAR(50) NOT NULL,
    status TINYINT DEFAULT 1
);

-- 人效汇总表（月度）
CREATE TABLE monthly_efficiency (
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    efficiency DECIMAL(10,4),
    inbound_efficiency DECIMAL(10,4),
    outbound_efficiency DECIMAL(10,4),
    shelve_efficiency DECIMAL(10,4),
    qc_efficiency DECIMAL(10,4),
    total_quantity DECIMAL(15,2),
    avg_headcount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES team(id),
    UNIQUE KEY unique_team_month (team_id, year, month)
);
```

### 7.2 ER关系图

```
users ──1:1── team ──N:1── warehouse
                          │
                          │
weekly_report ──1:N── weekly_report_detail
                          │
                          ↓
                   std_efficiency (配置表)

weekly_report ──汇总──> monthly_efficiency
```

---

## 八、API接口设计

### 8.1 认证模块

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/register | 用户注册 |
| GET | /api/auth/me | 获取当前用户 |

### 8.2 H5数据上报

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | /api/reports | 提交周报 |
| GET | /api/reports/mine | 我的上报记录 |
| PUT | /api/reports/:id | 修改我的上报 |
| GET | /api/reports/week/:year/:week | 某周我的数据 |

### 8.3 管理后台

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | /api/teams | 小组列表 |
| POST | /api/teams | 创建小组 |
| PUT | /api/teams/:id | 编辑小组 |
| DELETE | /api/teams/:id | 删除小组 |
| GET | /api/warehouses | 仓库列表 |
| GET | /api/reports/all | 所有人效数据 |
| PUT | /api/reports/:id/audit | 审核数据 |
| GET | /api/reports/monthly | 月度汇总 |

### 8.4 数据展示

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | /api/dashboard/summary | 汇总数据 |
| GET | /api/dashboard/ranking | 排名数据 |
| GET | /api/dashboard/trend | 趋势数据 |

### 8.5 系统配置

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | /api/config/std-efficiency | 获取标准人效 |
| PUT | /api/config/std-efficiency/:id | 更新标准人效 |
| GET | /api/config/thresholds | 获取阈值配置 |
| PUT | /api/config/thresholds | 更新阈值 |

---

## 九、技术架构

### 9.1 技术选型

| 层级 | 方案 | 说明 |
|---|---|---|
| H5前端 | Vue3 + Vant4 | 移动端友好 |
| Web后台 | Vue3 + Element Plus | PC端完整功能 |
| 后端 | Node.js + Express/NestJS | 轻量快速 |
| 数据库 | MySQL 8.0 | 成熟稳定 |
| 缓存 | Redis | 可选 |

### 9.2 项目结构

```
efficiency-system/
├── h5/                    # H5移动端
│   ├── src/
│   │   ├── views/        # 页面
│   │   ├── stores/       # 状态管理
│   │   └── api/          # 接口调用
│   └── index.html
│
├── admin/                 # Web管理后台
│   ├── src/
│   │   ├── views/        # 页面
│   │   ├── stores/       # 状态管理
│   │   └── api/          # 接口调用
│   └── index.html
│
├── server/                # 后端服务
│   ├── src/
│   │   ├── routes/       # 路由
│   │   ├── controllers/  # 控制器
│   │   ├── services/     # 业务逻辑
│   │   ├── models/       # 数据模型
│   │   └── middleware/   # 中间件
│   └── config/          # 配置文件
│
├── docs/                  # 文档
│   └── DESIGN.md
│
└── README.md
```

---

## 十、开发优先级

### 第一阶段（核心闭环）

1. 用户登录/认证
2. H5数据上报
3. Web后台数据展示
4. 月度汇总自动计算

### 第二阶段（体验优化）

1. 趋势图表
2. 排名功能
3. 导出功能
4. 消息通知

### 第三阶段（高级功能）

1. 微信推送
2. 数据预警
3. 报表自定义

---

## 十一、现有数据继承

### 11.1 已提取的Excel数据

| 文件 | 说明 |
|---|---|
| 25年小组人效月度数据.csv | 2025年1-9月各小组人效汇总 |
| 标准人效指标.csv | 各业务动作的标准人效 |
| 客户数据.csv | 客户信息、仓库归属 |
| 场地租金.csv | 场地租赁信息 |

### 11.2 数据迁移

系统上线后，可将历史人效数据导入系统，保持历史追溯。

---

## 十二、附录

### 12.1 名词解释

| 术语 | 说明 |
|---|---|
| 人效 | 实际产出 / 标准产出，>1表示超出标准 |
| 达标率 | 人效>=1的小组占比 |
| 正式工 | 正式雇佣员工 |
| 劳务工 | 第三方劳务派遣员工 |

### 12.2 参考文献

- 项目原型: prototype.html
- 产品规格: SPEC.md
- 设计方案: 设计方案.md
