#!/bin/bash

# 停止所有容器
docker-compose down

# 清理卷（慎用，会删除数据库）
read -p "是否删除数据库数据? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down -v
    echo "已删除所有数据"
else
    docker-compose down
fi

# 清理镜像
docker image prune -f

echo "清理完成"