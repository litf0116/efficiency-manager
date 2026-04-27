# 部署指南

## 服务器推荐配置

### 最低配置
- CPU: 2 核
- 内存: 4 GB
- 系统盘: 40 GB SSD
- 数据盘: 50 GB（用于数据库存储）

### 生产环境配置
- CPU: 4 核
- 内存: 8 GB
- 系统盘: 40 GB SSD
- 数据盘: 100 GB SSD

### 推荐云服务商
- 阿里云 ECS（推荐）
- 腾讯云 CVM
- 华为云 ECS

---

## 部署步骤

### 1. 服务器初始化

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 2. 上传代码到服务器

```bash
# 在本地项目目录打包
tar -czvf efficiency-manager.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='admin/node_modules' \
  --exclude='h5/node_modules' \
  --exclude='miniprogram/node_modules' \
  .

# 上传到服务器
scp efficiency-manager.tar.gz user@your-server:/home/ubuntu/

# 在服务器解压
ssh user@your-server
cd /home/ubuntu
tar -xzvf efficiency-manager.tar.gz
```

### 3. 配置环境变量

```bash
cd efficiency-manager
cp .env.prod.example .env.prod
nano .env.prod
```

修改以下配置：
- `POSTGRES_PASSWORD`: 数据库密码（必须修改）
- `JWT_SECRET`: JWT 密钥（必须修改，使用随机字符串）

### 4. 配置 SSL 证书

将 SSL 证书放入 `nginx/ssl/` 目录：
- `cert.pem` - 证书文件
- `key.pem` - 私钥文件

如果使用 Let's Encrypt：
```bash
sudo apt install certbot
certbot certonly --nginx -d your-domain.com
# 复制证书
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem
```

### 5. 执行部署

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 6. 验证部署

```bash
# 检查容器状态
docker-compose ps

# 查看日志
docker-compose logs -f backend

# 访问服务
curl http://your-server-ip/api/admin/config/current-week
```

---

## 服务地址

| 服务 | 地址 |
|------|------|
| 管理后台 | http://your-server-ip/admin/ |
| H5 前端 | http://your-server-ip/h5/ |
| Admin API 文档 | http://your-server-ip/docs/admin |
| Client API 文档 | http://your-server-ip/docs/h5 |

---

## 常用运维命令

```bash
# 查看日志
docker-compose logs -f [backend|postgres|nginx]

# 重启服务
docker-compose restart [backend|nginx]

# 更新部署
git pull origin main
./scripts/deploy.sh

# 停止服务
docker-compose down

# 完全清理（删除数据库）
./scripts/cleanup.sh
```

---

## 域名配置

将域名解析到服务器 IP：

| 记录类型 | 主机记录 | 解析记录 |
|----------|----------|----------|
| A | api | your-server-ip |
| A | admin | your-server-ip |
| A | h5 | your-server-ip |

然后修改 `nginx/nginx.conf` 中的 `server_name` 为你的域名。

---

## 数据备份

```bash
# 备份数据库
docker-compose exec -T postgres pg_dump -U efficiency efficiency_manager > backup_$(date +%Y%m%d).sql

# 恢复数据库
docker-compose exec -T postgres psql -U efficiency efficiency_manager < backup_20241026.sql
```

---

## 故障排查

### 容器无法启动
```bash
docker-compose logs backend
docker-compose logs postgres
```

### 数据库连接失败
```bash
# 检查数据库是否就绪
docker-compose exec postgres pg_isready

# 查看连接信息
docker-compose exec backend env | grep DATABASE
```

### 前端静态资源 404
```bash
# 检查文件是否存在
docker-compose exec nginx ls -la /usr/share/nginx/html/admin/
docker-compose exec nginx ls -la /usr/share/nginx/html/h5/
```

### SSL 证书问题
```bash
# 检查证书
openssl x509 -in nginx/ssl/cert.pem -text -noout
```