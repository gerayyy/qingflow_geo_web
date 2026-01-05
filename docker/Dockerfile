# 使用与项目一致的 Node.js 20+ 镜像作为构建基础（Next.js 16 推荐）
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖，用于构建）
# 使用国内镜像源并增加超时时间以解决网络问题
RUN npm config set registry https://registry.npmmirror.com/ && npm ci --verbose --fetch-timeout=1200000

# 复制项目文件
COPY . .

# 生成 Prisma 客户端并构建应用
RUN npx prisma generate && npm run build

# 使用轻量级镜像作为运行时基础
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制必要的文件
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动应用（Prisma 客户端已在构建阶段生成）
CMD ["npm", "start"]
