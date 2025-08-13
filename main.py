"""
塔罗占卜师应用的FastAPI接口
提供RESTful API服务
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import uuid
import json
from datetime import datetime

from flow import create_tarot_flow, create_simple_divination_flow
from utils.tarot_cards import get_topics, get_spreads, get_card_by_id
from utils.card_drawer import simulate_draw_process

# FastAPI应用实例
app = FastAPI(
    title="塔罗占卜师 API",
    description="智能塔罗占卜服务API",
    version="1.0.0"
)

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # 前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 在内存中存储会话数据（生产环境应使用数据库）
sessions: Dict[str, Dict[str, Any]] = {}

# Pydantic模型定义
class StartDivinationRequest(BaseModel):
    user_id: Optional[str] = None

class DivationStepRequest(BaseModel):
    session_id: str
    step: str
    data: Dict[str, Any] = {}

class DivationResponse(BaseModel):
    session_id: str
    status: str
    message: str
    next_step: Optional[str] = None
    data: Dict[str, Any] = {}

class CardInfo(BaseModel):
    id: str
    name: str
    description: str
    keywords: List[str]
    image_url: str

class DivinationStatus(BaseModel):
    session_id: str
    current_step: str
    progress: int
    completed: bool
    history: List[Dict[str, Any]]

@app.get("/")
async def root():
    """API根端点"""
    return {"message": "欢迎使用塔罗占卜师API ✨🔮"}

@app.post("/api/v1/divination/start", response_model=DivationResponse)
async def start_divination(request: StartDivinationRequest):
    """开始新的占卜会话"""
    try:
        # 创建新会话
        session_id = str(uuid.uuid4())
        
        # 初始化共享存储
        shared = {
            "user_session": {
                "user_id": request.user_id or str(uuid.uuid4()),
                "current_step": "welcome",
                "conversation_history": []
            },
            "divination": {
                "topic": None,
                "spread_type": None,
                "drawn_cards": [],
                "interpretation": None,
                "advice": None,
                "status": "started"
            },
            "ui_spec": {},
            "style_spec": {}
        }
        
        # 运行欢迎节点
        from nodes import WelcomeNode
        welcome_node = WelcomeNode()
        action = welcome_node.run(shared)
        
        # 存储会话
        sessions[session_id] = shared
        
        # 获取欢迎消息
        welcome_message = shared["user_session"]["conversation_history"][-1]["message"]
        
        return DivationResponse(
            session_id=session_id,
            status="started",
            message=welcome_message,
            next_step="topic_selection",
            data={"available_topics": list(get_topics().keys())}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"启动占卜失败: {str(e)}")

@app.post("/api/v1/divination/step", response_model=DivationResponse)
async def process_divination_step(request: DivationStepRequest):
    """处理占卜流程中的步骤"""
    try:
        # 检查会话是否存在
        if request.session_id not in sessions:
            raise HTTPException(status_code=404, detail="会话不存在")
        
        shared = sessions[request.session_id]
        current_step = shared["user_session"]["current_step"]
        
        # 根据步骤处理用户输入
        if request.step == "select_topic":
            selected_topic = request.data.get("topic")
            if not selected_topic:
                raise HTTPException(status_code=400, detail="请选择占卜主题")
            
            # 将用户输入存储到shared中
            shared["user_input"] = {"selected_topic": selected_topic}
            
            # 创建并运行处理主题节点
            from nodes import ProcessTopicNode
            process_topic_node = ProcessTopicNode()
            action = process_topic_node.run(shared)
            
            # 更新会话
            sessions[request.session_id] = shared
            
            # 获取响应消息
            latest_message = shared["user_session"]["conversation_history"][-1]["message"]
            
            return DivationResponse(
                session_id=request.session_id,
                status="processing",
                message=latest_message,
                next_step=action,
                data={"available_spreads": list(get_spreads().keys())} if action == "spread_selection" else {}
            )
            
        elif request.step == "select_spread":
            selected_spread = request.data.get("spread")
            if not selected_spread:
                raise HTTPException(status_code=400, detail="请选择牌阵类型")
            
            shared["user_input"] = {"selected_spread": selected_spread}
            
            from nodes import ProcessSpreadNode
            process_spread_node = ProcessSpreadNode()
            action = process_spread_node.run(shared)
            
            latest_message = shared["user_session"]["conversation_history"][-1]["message"]
            
            return DivationResponse(
                session_id=request.session_id,
                status="processing",
                message=latest_message,
                next_step=action,
                data={}
            )
            
        elif request.step == "draw_cards":
            # 只执行抽牌，不执行解读和建议
            from nodes import CardDrawingNode
            
            # 抽牌
            card_drawing_node = CardDrawingNode()
            action = card_drawing_node.run(shared)
            
            # 更新会话
            sessions[request.session_id] = shared
            
            # 获取抽牌结果
            conversation = shared["user_session"]["conversation_history"]
            cards_message = next((h["message"] for h in reversed(conversation) if h["step"] == "cards_drawn"), "")
            
            full_message = cards_message
            
            return DivationResponse(
                session_id=request.session_id,
                status="cards_drawn",
                message=full_message,
                next_step="interpretation",
                data={
                    "drawn_cards": shared["divination"]["drawn_cards"]
                }
            )
            
        elif request.step == "get_interpretation":
            # 获取解读
            from nodes import InterpretationNode
            
            interpretation_node = InterpretationNode()
            action = interpretation_node.run(shared)
            
            # 更新会话
            sessions[request.session_id] = shared
            
            latest_message = shared["user_session"]["conversation_history"][-1]["message"]
            
            return DivationResponse(
                session_id=request.session_id,
                status="interpreted",
                message=latest_message,
                next_step="advice",
                data={
                    "interpretation": shared["divination"]["interpretation"]
                }
            )
            
        elif request.step == "get_advice":
            # 获取建议
            from nodes import AdviceNode
            
            advice_node = AdviceNode()
            action = advice_node.run(shared)
            
            # 更新会话
            sessions[request.session_id] = shared
            
            latest_message = shared["user_session"]["conversation_history"][-1]["message"]
            
            return DivationResponse(
                session_id=request.session_id,
                status="completed",
                message=latest_message,
                next_step="completed",
                data={
                    "advice": shared["divination"]["advice"]
                }
            )
            
        else:
            raise HTTPException(status_code=400, detail=f"未知的步骤: {request.step}")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理步骤失败: {str(e)}")

@app.get("/api/v1/cards/{card_id}", response_model=CardInfo)
async def get_card_info(card_id: str):
    """获取塔罗牌信息"""
    try:
        card = get_card_by_id(card_id)
        if not card:
            raise HTTPException(status_code=404, detail="塔罗牌不存在")
        
        return CardInfo(
            id=card["id"],
            name=card["name"],
            description=card["upright_meaning"],
            keywords=card["keywords"],
            image_url=f"/cards/{card_id}.jpg"  # 假设的图片URL
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取塔罗牌信息失败: {str(e)}")

@app.get("/api/v1/divination/{session_id}/status", response_model=DivinationStatus)
async def get_divination_status(session_id: str):
    """获取占卜会话状态"""
    try:
        if session_id not in sessions:
            raise HTTPException(status_code=404, detail="会话不存在")
        
        shared = sessions[session_id]
        user_session = shared["user_session"]
        divination = shared["divination"]
        
        # 计算进度
        step_progress = {
            "welcome": 10,
            "topic_selection": 20,
            "waiting_topic": 30,
            "spread_selection": 40,
            "waiting_spread": 50,
            "drawing_cards": 60,
            "interpretation": 80,
            "advice": 90,
            "completed": 100
        }
        
        current_step = user_session["current_step"]
        progress = step_progress.get(current_step, 0)
        completed = divination.get("status") == "completed"
        
        return DivinationStatus(
            session_id=session_id,
            current_step=current_step,
            progress=progress,
            completed=completed,
            history=user_session["conversation_history"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取状态失败: {str(e)}")

@app.get("/api/v1/topics")
async def get_available_topics():
    """获取可用的占卜主题"""
    return {"topics": get_topics()}

@app.get("/api/v1/spreads")
async def get_available_spreads():
    """获取可用的牌阵类型"""
    return {"spreads": get_spreads()}

# 简化版占卜接口（用于快速测试）
@app.post("/api/v1/divination/quick")
async def quick_divination():
    """快速占卜（单张牌）"""
    try:
        # 使用简化流程
        shared = {
            "divination": {
                "topic": "general",
                "spread_type": "single",
                "drawn_cards": [],
                "interpretation": None,
                "advice": None
            }
        }
        
        # 执行简化流程
        simple_flow = create_simple_divination_flow()
        simple_flow.run(shared)
        
        divination = shared["divination"]
        
        return {
            "status": "completed",
            "drawn_cards": divination["drawn_cards"],
            "interpretation": divination["interpretation"],
            "advice": divination["advice"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"快速占卜失败: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    import os
    
    # 获取端口，支持生产环境
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    
    print("启动塔罗占卜师API服务...")
    print(f"API服务地址: http://{host}:{port}")
    print(f"API文档: http://{host}:{port}/docs")
    
    # 生产环境不使用reload
    is_dev = os.environ.get("ENVIRONMENT", "development") == "development"
    uvicorn.run("main:app", host=host, port=port, reload=is_dev)