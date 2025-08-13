#!/bin/bash

# 塔罗占卜师应用启动脚本

echo "🔮 启动塔罗占卜师应用..."

# 检查环境变量
if [ ! -f .env ]; then
    echo "⚠️  .env文件不存在，复制env.template"
    cp env.template .env
fi

# 启动后端服务
echo "🚀 启动后端服务 (FastAPI)..."
echo "后端将在 http://localhost:8000 启动"
echo "API文档: http://localhost:8000/docs"

# 检查是否安装了依赖
if [ ! -d "venv" ]; then
    echo "📦 创建Python虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境并安装依赖
source venv/bin/activate
echo "📦 安装后端依赖..."
pip install -r requirements.txt

# 启动后端（后台运行）
echo "🔧 启动后端服务..."
python3 main.py &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端服务
echo "🌐 启动前端服务 (Next.js)..."
echo "前端将在 http://localhost:3000 启动"

cd frontend

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

# 启动前端
echo "🔧 启动前端服务..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "✨ 塔罗占卜师应用已启动！"
echo ""
echo "🌐 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:8000"
echo "📚 API文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
wait $FRONTEND_PID $BACKEND_PID

echo "🛑 停止服务..."
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null

echo "👋 再见！"
