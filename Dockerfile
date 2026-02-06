# 生产优化的多阶段构建 Dockerfile
# 适用于 Next.js 16 + Node 22

# ---------- 1. 构建阶段 ----------
FROM node:22-alpine AS builder

# 工作目录
WORKDIR /app

# 只拷贝依赖相关文件，提高缓存命中率
COPY package.json ./

# 安装依赖（默认用 npm，你也可以改成 pnpm/yarn）
RUN npm install

# 拷贝剩余项目文件
COPY . .

# 构建 Next.js 应用
RUN npm run build

# ---------- 2. 运行阶段 ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 只拷贝运行时需要的文件
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Next.js 默认端口
EXPOSE 3000
# 以 Next.js 生产模式启动
CMD ["npm", "run", "start"]