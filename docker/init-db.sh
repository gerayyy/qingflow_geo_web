#!/bin/bash

# 数据库初始化脚本
# 用于在服务器环境中创建 Post 表结构
# 依赖: mysql 客户端

# 配置文件路径
ENV_FILE=".env"
SQL_FILE="init-db.sql"

# 检查配置文件是否存在
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ 错误: 配置文件 $ENV_FILE 不存在"
    echo "请先创建 .env 文件，可基于 .env.example 进行配置"
    exit 1
fi

# 检查 SQL 脚本是否存在
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ 错误: SQL 脚本 $SQL_FILE 不存在"
    exit 1
fi

# 从环境文件中加载配置
source "$ENV_FILE"

# 直接使用环境变量中的数据库连接信息
# 主机名：当在Docker容器外运行时，使用127.0.0.1强制使用TCP/IP；当在容器内运行时，使用db
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_NAME="$MYSQL_DATABASE"

# 选择使用的数据库用户（可以选择普通用户或根用户）
# 使用普通用户（推荐）
DB_USER="$MYSQL_USER"
DB_PASS="$MYSQL_PASSWORD"

# 或者使用根用户（仅在必要时使用）
# DB_USER="root"
# DB_PASS="$MYSQL_ROOT_PASSWORD"

# 检查是否提取到所有必要信息
if [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASS" ]; then
    echo "❌ 错误: 无法从环境变量中提取完整的数据库连接信息"
    echo "请确保 .env 文件中包含 MYSQL_DATABASE、MYSQL_USER 和 MYSQL_PASSWORD 变量"
    exit 1
fi

echo "=== 数据库初始化脚本 ==="
echo "数据库主机: $DB_HOST"
echo "数据库端口: $DB_PORT"
echo "数据库名称: $DB_NAME"
echo "数据库用户: $DB_USER"
echo "=========================="

# 执行 SQL 脚本
echo "开始执行建表脚本..."

mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" --force < "$SQL_FILE"

# 检查执行结果
if [ $? -eq 0 ]; then
    echo "✅ 数据库初始化成功！"
    echo "已成功创建 Post 表结构"
else
    echo "❌ 数据库初始化失败！"
    exit 1
fi
