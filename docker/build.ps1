#!/usr/bin/env pwsh

# 构建Docker镜像的PowerShell脚本
# 可以指定镜像名称和版本标签
# 示例用法：.build.ps1 -Name helyweb -Version 1.0.0

# 默认配置
$DefaultImageName = "helyweb"
$DefaultVersion = "latest"

# 显示帮助信息
function Show-Help {
    Write-Host "使用方法：$($MyInvocation.MyCommand.Name) [参数]"
    Write-Host ""
    Write-Host "参数："
    Write-Host "  -Name, -n    镜像名称 (默认: $DefaultImageName)"
    Write-Host "  -Version, -v 镜像版本标签 (默认: $DefaultVersion)"
    Write-Host "  -Help, -h    显示帮助信息"
    Write-Host ""
    Write-Host "示例："
    Write-Host "  .\build.ps1 -Name myapp -Version 1.2.3"
    Write-Host "  .\build.ps1 -n myapp -v 1.2.3"
    exit 0
}

# 解析命令行参数
[CmdletBinding()]
param (
    [Parameter(Position = 0)]
    [Alias("n")]
    [string]$Name = $DefaultImageName,
    
    [Parameter(Position = 1)]
    [Alias("v")]
    [string]$Version = $DefaultVersion,
    
    [Parameter()]
    [Alias("h")]
    [switch]$Help
)

# 如果请求帮助，则显示帮助信息
if ($Help) {
    Show-Help
}

# 设置镜像名称和版本
$ImageName = $Name
$Version = $Version

# 显示构建信息
Write-Host "=== Docker镜像构建脚本 (PowerShell) ==="
Write-Host "镜像名称: $ImageName"
Write-Host "镜像版本: $Version"
Write-Host "构建目录: $(Get-Location)"
Write-Host ""

# 执行构建命令
Write-Host "开始构建镜像..."
try {
    # 执行Docker构建
    docker build -t "${ImageName}:${Version}" -f Dockerfile ..
    
    # 检查构建结果
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host -ForegroundColor Green "✅ 镜像构建成功！"
        Write-Host "镜像名称: ${ImageName}:${Version}"
        Write-Host ""
        Write-Host "可以使用以下命令运行容器："
        Write-Host "docker run -d -p 3000:3000 ${ImageName}:${Version}"
    } else {
        Write-Host ""
        Write-Host -ForegroundColor Red "❌ 镜像构建失败！"
        exit $LASTEXITCODE
    }
} catch {
    Write-Host ""
    Write-Host -ForegroundColor Red "❌ 构建过程中发生错误：$($_.Exception.Message)"
    exit 1
}