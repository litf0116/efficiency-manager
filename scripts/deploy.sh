#!/bin/bash
set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== 仓储人效管理系统部署脚本 ===${NC}\n"

# 检查 Docker 和 Docker Compose
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}错误: Docker Compose 未安装${NC}"
    exit 1
fi

# 检查环境变量文件
if [ ! -f .env.prod ]; then
    echo -e "${YELLOW}警告: .env.prod 文件不存在，复制示例文件${NC}"
    cp .env.prod.example .env.prod
    echo -e "${YELLOW}请编辑 .env.prod 文件设置密码${NC}"
    exit 1
fi

# 创建 SSL 证书目录
mkdir -p nginx/ssl

# 拉取最新代码（如果有 Git）
if [ -d .git ]; then
    echo -e "${YELLOW}正在拉取最新代码...${NC}"
    git pull origin main
fi

# 构建前端
echo -e "${YELLOW}构建前端...${NC}"
cd admin && npm install && npm run build && cd ..
cd h5 && npm install && npm run build && cd ..

# 返回项目根目录
cd "$(dirname "$0")"

# 停止旧容器
echo -e "${YELLOW}停止旧容器...${NC}"
docker-compose down 2>/dev/null || true

# 构建并启动新容器
echo -e "${YELLOW}构建并启动容器...${NC}"
docker-compose up -d --build

# 等待数据库就绪
echo -e "${YELLOW}等待数据库就绪...${NC}"
sleep 10

# 执行数据库迁移
echo -e "${YELLOW}执行数据库迁移...${NC}"
docker-compose exec -T backend npx prisma migrate deploy

# 初始化数据（可选）
read -p "是否初始化种子数据? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose exec -T backend npx prisma db seed
fi

# 检查服务状态
echo -e "${YELLOW}检查服务状态...${NC}"
docker-compose ps

echo -e "\n${GREEN}部署完成!${NC}"
echo -e "管理后台: http://your-server-ip/admin/"
echo -e "H5 前端: http://your-server-ip/h5/"
echo -e "API 文档: http://your-server-ip/docs/admin"