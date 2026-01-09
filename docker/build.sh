#!/bin/bash

# 构建Docker镜像的脚本
# 可以指定镜像名称和版本标签
# 示例用法：./build.sh --name helyweb --version 1.0.0

# 默认配置
DEFAULT_IMAGE_NAME="helyweb"
DEFAULT_VERSION="latest"

# 显示帮助信息
show_help() {
    echo "使用方法：$0 [OPTIONS]"
    echo ""
    echo "选项："
    echo "  --name, -n    镜像名称 (默认: $DEFAULT_IMAGE_NAME)"
    echo "  --version, -v 镜像版本标签 (默认: $DEFAULT_VERSION)"
    echo "  --help, -h    显示帮助信息"
    echo ""
    echo "示例："
    echo "  $0 --name myapp --version 1.2.3"
    echo "  $0 -n myapp -v 1.2.3"
    exit 0
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --name|-n)
            IMAGE_NAME="$2"
            shift 2
            ;;
        --version|-v)
            VERSION="$2"
            shift 2
            ;;
        --help|-h)
            show_help
            ;;
        *)
            echo "未知选项: $1"
            show_help
            ;;
    esac
done

# 设置默认值
IMAGE_NAME=${IMAGE_NAME:-$DEFAULT_IMAGE_NAME}
VERSION=${VERSION:-$DEFAULT_VERSION}

# 显示构建信息
echo "=== Docker镜像构建脚本 ==="
echo "镜像名称: $IMAGE_NAME"
echo "镜像版本: $VERSION"
echo "构建目录: $(pwd)"
echo ""

# 执行构建命令
echo "开始构建镜像..."
docker build -t "${IMAGE_NAME}:${VERSION}" -f docker/Dockerfile .

# 检查构建结果
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 镜像构建成功！"
    echo "镜像名称: ${IMAGE_NAME}:${VERSION}"
    echo ""
    echo "可以使用以下命令运行容器："
    echo "docker run -d -p 3000:3000 ${IMAGE_NAME}:${VERSION}"
else
    echo ""
    echo "❌ 镜像构建失败！"
    exit 1
fi
