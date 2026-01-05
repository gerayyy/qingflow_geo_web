# Helyweb Docker 部署指南

本文件夹包含 Helyweb 项目的 Docker 部署配置文件，用于构建和运行项目的 Docker 镜像。

## 文件结构

```
docker/
├── Dockerfile              # 用于构建 Next.js 应用镜像的 Dockerfile
├── docker-compose.yml      # 用于编排 Next.js 应用和 MySQL 数据库的 docker-compose 配置（包含 build 命令）
├── docker-compose-prod.yml # 直接使用镜像部署的 docker-compose 配置（不含 build 命令）
└── README.md               # 本使用说明文件
```

## 部署准备

### 1. 环境要求

- Docker 19.03+ 已安装并运行
- Docker Compose 1.27+ 已安装

### 2. **配置环境变量**

1. 复制环境变量模板文件：
   ```bash
   cp .env.example .env
   ```

2. 根据需要修改 `.env` 文件中的配置：
   ```bash
   # MySQL 数据库配置
   MYSQL_ROOT_PASSWORD=root_2025
   MYSQL_DATABASE=web
   MYSQL_USER=web_dev
   MYSQL_PASSWORD=ev_2025
   
   # API 配置
   API_SECRET_KEY=this-is-a-very-long-secret-key-for-production-use
   ```

   **注意事项：**
   - 生产环境中请务必使用强密码和密钥
   - `API_SECRET_KEY` 至少需要 32 个字符

## 部署方式

### 方式一：使用 Docker Compose 部署（推荐）

#### 1. 构建并启动服务

在 `docker` 目录下执行：

```bash
docker-compose up -d
```

该命令会：
- 构建 Next.js 应用镜像
- 启动 MySQL 数据库容器
- 启动 Next.js 应用容器
- 配置容器间网络连接

#### 2. 查看服务状态

```bash
docker-compose ps
```

#### 3. 查看应用日志

```bash
docker-compose logs -f app
```

#### 4. 查看数据库日志

```bash
docker-compose logs -f db
```

#### 5. 停止服务

```bash
docker-compose down
```

#### 6. 停止服务并删除数据卷

```bash
docker-compose down -v
```

### 方式二：使用预构建镜像部署（docker-compose-prod.yml）

如果您已经构建了镜像或从其他地方获取了镜像，可以使用此配置文件直接部署，无需重新构建。

#### 1. 准备环境变量文件

`.env.example` 文件已经包含了所有必要的环境变量配置，根据需要修改其中的配置即可。

如果需要创建新的环境变量文件：

```bash
cp .env.example .env
```

然后根据需要修改 `.env` 文件中的配置。

#### 2. 启动服务

在 `docker` 目录下执行：

```bash
docker-compose -f docker-compose-prod.yml up -d
```

#### 3. 查看服务状态

```bash
docker-compose -f docker-compose-prod.yml ps
```

#### 4. 查看应用日志

```bash
docker-compose -f docker-compose-prod.yml logs -f app
```

#### 5. 停止服务

```bash
docker-compose -f docker-compose-prod.yml down
```

### 方式三：手动构建和运行 Docker 镜像

#### 1. 构建 Docker 镜像

在项目根目录执行：

```bash
docker build -t helyweb:latest -f docker/Dockerfile .
```

#### 2. 运行 MySQL 容器

```bash
docker run -d \
  --name helyweb_db \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=helyweb_root_2025 \
  -e MYSQL_DATABASE=helyweb \
  -e MYSQL_USER=helyweb_dev \
  -e MYSQL_PASSWORD=helyweb_dev_2025 \
  -v mysql_data:/var/lib/mysql \
  --restart unless-stopped \
  mysql:8.0 \
  --default-authentication-plugin=mysql_native_password
```

#### 3. 运行 Next.js 应用容器

```bash
docker run -d \
  --name helyweb_app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=mysql://helyweb_dev:helyweb_dev_2025@helyweb_db:3306/helyweb?schema=public \
  -e API_SECRET_KEY=this-is-a-very-long-secret-key-for-production-use \
  --link helyweb_db \
  --restart unless-stopped \
  helyweb:latest
```

## 访问应用

应用成功启动后，可以通过以下地址访问：

- 首页：http://localhost:3000
- 博客列表页：http://localhost:3000/blog
- API 健康检查：http://localhost:3000/api/health

## 首次部署注意事项

1. **数据库初始化**：
   - 首次启动数据库时，会自动创建指定的数据库和用户
   - Next.js 应用启动时会自动生成 Prisma 客户端

2. **数据库迁移**：
   - 如果需要执行数据库迁移，可以进入应用容器执行：
     ```bash
     docker-compose exec app npx prisma db push
     ```

3. **生成 Prisma 客户端**：
   - 如果修改了 Prisma schema，需要重新生成 Prisma 客户端：
     ```bash
     docker-compose exec app npx prisma generate
     ```

## 常见问题与解决方案

### 1. 应用无法连接到数据库

- 检查环境变量 `DATABASE_URL` 是否正确配置
- 检查 MySQL 容器是否正常运行
- 检查容器间网络连接是否正常

### 2. 应用启动失败

- 查看应用日志获取详细错误信息：
  ```bash
  docker-compose logs -f app
  ```
- 检查环境变量是否正确配置
- 检查端口是否被占用

### 3. MySQL 容器启动失败

- 查看 MySQL 日志获取详细错误信息：
  ```bash
  docker-compose logs -f db
  ```
- 检查数据卷是否已存在且正常
- 检查端口 3306 是否被占用

### 4. 构建镜像时依赖安装失败

- 检查网络连接是否正常
- 考虑使用国内镜像源加速依赖安装

## 更新部署

### 1. 拉取最新代码

```bash
git pull origin main
```

### 2. 重新构建并启动服务

```bash
docker-compose down
cd docker
docker-compose up -d --build
```

## 生产环境部署建议

1. **使用 HTTPS**：
   - 配置 Nginx 或 Caddy 作为反向代理，启用 HTTPS
   - 使用 Let's Encrypt 免费 SSL 证书

2. **配置 CDN**：
   - 接入 Cloudflare 或其他 CDN 服务，加速静态资源访问
   - 配置适当的缓存规则

3. **监控与日志**：
   - 配置日志收集服务（如 ELK Stack、Graylog 等）
   - 配置应用性能监控（如 New Relic、Datadog 等）
   - 配置数据库监控

4. **定期备份**：
   - 定期备份 MySQL 数据库
   - 定期备份应用代码和配置文件

5. **安全加固**：
   - 关闭不必要的端口
   - 定期更新 Docker 镜像
   - 使用最小权限原则配置容器用户
   - 配置防火墙规则

## 开发环境与生产环境的区别

| 环境 | 特点 | 适用场景 |
| :--- | :--- | :--- |
| 开发环境 | 热重载、详细日志、调试模式 | 本地开发、测试 |
| 生产环境 | 性能优先、最小依赖、安全加固 | 线上部署、生产使用 |

## 联系方式

如有任何问题或建议，欢迎提交 Issue 或联系项目维护人员。
