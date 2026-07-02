# 生产优化的多阶段构建 Dockerfile
# 适用于 Next.js 16 + React 19 + Node 22

# ---------- 1. 构建阶段 ----------
FROM node:22-alpine AS builder

WORKDIR /app

# 只拷贝依赖相关文件，提高缓存命中率
COPY package.json package-lock.json* ./

# 安装依赖（与 vercel.json 保持一致）
RUN npm install --legacy-peer-deps

# 拷贝剩余项目文件
COPY . .

# 构建 Next.js 应用（standalone 模式）
RUN npm run build

# ---------- 2. 运行阶段 ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 只拷贝 standalone 运行时需要的文件
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 运行时环境变量（通过 docker run -e 传入，不留在镜像层中）
ENV BAIDU_API_KEY=""
ENV BAIDU_SECRET_KEY=""

# Next.js 默认端口
EXPOSE 3000

# 以 Next.js standalone 生产模式启动
CMD ["node", "server.js"]
