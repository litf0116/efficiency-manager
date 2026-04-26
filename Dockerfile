# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm ci --only=production=false

# 复制源代码
COPY . .
RUN npx prisma generate
RUN npm run build

# 生产阶段
FROM node:20-alpine AS production

WORKDIR /app

# 安装依赖（生产环境）
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

# 环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/admin/config/current-week || exit 1

# 启动命令
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]