"""
塔罗占卜师应用的流程定义
连接各个节点构建完整的占卜流程
"""

from macore import Flow
from nodes import (
    WelcomeNode, TopicSelectionNode, ProcessTopicNode,
    SpreadSelectionNode, ProcessSpreadNode, CardDrawingNode,
    InterpretationNode, AdviceNode
)

def create_tarot_flow():
    """
    创建塔罗占卜的完整流程
    
    Returns:
        Flow: 配置好的塔罗占卜流程
    """
    # 创建所有节点
    welcome = WelcomeNode()
    topic_selection = TopicSelectionNode()
    process_topic = ProcessTopicNode()
    spread_selection = SpreadSelectionNode()
    process_spread = ProcessSpreadNode()
    card_drawing = CardDrawingNode()
    interpretation = InterpretationNode()
    advice = AdviceNode()
    
    # 连接节点流程
    # 欢迎 -> 主题选择
    welcome - "topic_selection" >> topic_selection
    
    # 主题选择 -> 等待用户输入
    topic_selection - "waiting_topic" >> process_topic
    
    # 处理主题 -> 牌阵选择 或 重新选择主题
    process_topic - "spread_selection" >> spread_selection
    process_topic - "topic_selection" >> topic_selection
    
    # 牌阵选择 -> 等待用户输入
    spread_selection - "waiting_spread" >> process_spread
    
    # 处理牌阵 -> 抽牌 或 重新选择牌阵
    process_spread - "drawing_cards" >> card_drawing
    process_spread - "spread_selection" >> spread_selection
    
    # 抽牌 -> 解读
    card_drawing - "interpretation" >> interpretation
    
    # 解读 -> 建议
    interpretation - "advice" >> advice
    
    # 创建并返回流程，从欢迎节点开始
    return Flow(start=welcome)

def create_simple_divination_flow():
    """
    创建简化版占卜流程（用于测试）
    直接进行单张牌占卜
    
    Returns:
        Flow: 简化的占卜流程
    """
    # 只包含核心节点
    card_drawing = CardDrawingNode()
    interpretation = InterpretationNode()
    advice = AdviceNode()
    
    # 简单连接
    card_drawing - "interpretation" >> interpretation
    interpretation - "advice" >> advice
    
    return Flow(start=card_drawing)

# 创建流程实例
tarot_flow = create_tarot_flow()
simple_flow = create_simple_divination_flow()