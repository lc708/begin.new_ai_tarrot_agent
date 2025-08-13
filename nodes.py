"""
塔罗占卜师应用的节点实现
包含占卜流程中的各个步骤节点
"""

from macore import Node
from utils.call_llm import call_tarot_llm
from utils.tarot_cards import get_topics, get_spreads, get_card_by_id
from utils.card_drawer import simulate_draw_process
import json
import uuid
from typing import Dict, Any

class WelcomeNode(Node):
    """欢迎节点 - 塔罗占卜师打招呼和介绍"""
    
    def prep(self, shared):
        # 准备欢迎消息，检查是否是新会话
        session_id = shared.get("user_session", {}).get("user_id")
        return {"is_new_session": session_id is None}
    
    def exec(self, prep_res):
        # 调用LLM生成个性化欢迎词，如果失败则使用默认消息
        try:
            if prep_res["is_new_session"]:
                prompt = """请作为塔罗占卜师星月，向新用户打招呼并介绍自己。要包含：
1. 友好的问候
2. 简单介绍自己的名字和职业
3. 说明接下来会进行什么样的占卜体验
4. 让用户感到放松和期待"""
            else:
                prompt = "欢迎回来！准备开始新的塔罗占卜吗？"
            
            return call_tarot_llm(prompt)
        except Exception as e:
            # LLM调用失败时的默认消息
            if prep_res["is_new_session"]:
                return "🔮✨ 你好！我是塔罗占卜师星月~ 欢迎来到神秘的塔罗世界！准备好开始你的占卜之旅了吗？"
            else:
                return "🔮 欢迎回来！准备开始新的塔罗占卜吗？"
    
    def post(self, shared, prep_res, exec_res):
        # 初始化用户会话信息
        if "user_session" not in shared:
            shared["user_session"] = {
                "user_id": str(uuid.uuid4()),
                "current_step": "welcome",
                "conversation_history": []
            }
        
        # 记录欢迎消息
        shared["user_session"]["conversation_history"].append({
            "step": "welcome",
            "message": exec_res,
            "timestamp": "now"
        })
        
        # 准备进入主题选择
        shared["user_session"]["current_step"] = "topic_selection"
        return "topic_selection"

class TopicSelectionNode(Node):
    """主题选择节点 - 让用户选择占卜主题"""
    
    def prep(self, shared):
        # 准备主题选项列表
        topics = get_topics()
        return {
            "topics": topics,
            "conversation_history": shared.get("user_session", {}).get("conversation_history", [])
        }
    
    def exec(self, prep_res):
        # 生成引导用户选择主题的话术
        topics = prep_res["topics"]
        topic_list = "\n".join([f"{i+1}. {topic['emoji']} {topic['name']} - {topic['description']}" 
                               for i, topic in enumerate(topics.values())])
        
        prompt = f"""现在要引导用户选择占卜主题。可选的主题有：

{topic_list}

请生成一段话来：
1. 说明要选择占卜主题
2. 简单介绍这些主题
3. 让用户选择感兴趣的主题
4. 保持轻松愉快的语气"""
        
        return call_tarot_llm(prompt)
    
    def post(self, shared, prep_res, exec_res):
        # 记录主题选择引导消息
        shared["user_session"]["conversation_history"].append({
            "step": "topic_selection_guide",
            "message": exec_res,
            "available_topics": list(prep_res["topics"].keys()),
            "timestamp": "now"
        })
        
        # 等待用户选择主题
        shared["user_session"]["current_step"] = "waiting_topic"
        return "waiting_topic"

class ProcessTopicNode(Node):
    """处理用户选择的主题"""
    
    def prep(self, shared):
        # 从输入中获取用户选择的主题
        selected_topic = shared.get("user_input", {}).get("selected_topic")
        topics = get_topics()
        return {
            "selected_topic": selected_topic,
            "topics": topics
        }
    
    def exec(self, prep_res):
        selected_topic = prep_res["selected_topic"]
        topics = prep_res["topics"]
        
        if selected_topic not in topics:
            return call_tarot_llm(f"不好意思，我没有理解你选择的主题。请从以下选项中选择：{list(topics.keys())}")
        
        topic_info = topics[selected_topic]
        prompt = f"""用户选择了{topic_info['emoji']} {topic_info['name']}主题。请：
1. 确认用户的选择
2. 简单说明这个主题的占卜会涉及什么
3. 表达期待和鼓励
4. 引导进入下一步选择牌阵"""
        
        return call_tarot_llm(prompt)
    
    def post(self, shared, prep_res, exec_res):
        # 存储用户选择的主题
        if prep_res["selected_topic"] in prep_res["topics"]:
            shared["divination"]["topic"] = prep_res["selected_topic"]
            shared["user_session"]["current_step"] = "spread_selection"
            next_action = "spread_selection"
        else:
            # 主题选择无效，重新选择
            next_action = "topic_selection"
        
        shared["user_session"]["conversation_history"].append({
            "step": "topic_confirmed",
            "message": exec_res,
            "selected_topic": prep_res["selected_topic"],
            "timestamp": "now"
        })
        
        return next_action

class SpreadSelectionNode(Node):
    """牌阵选择节点 - 让用户选择牌阵类型"""
    
    def prep(self, shared):
        # 准备牌阵选项和当前主题
        spreads = get_spreads()
        current_topic = shared.get("divination", {}).get("topic")
        topics = get_topics()
        
        return {
            "spreads": spreads,
            "current_topic": current_topic,
            "topic_info": topics.get(current_topic, {})
        }
    
    def exec(self, prep_res):
        spreads = prep_res["spreads"]
        topic_info = prep_res["topic_info"]
        
        spread_list = "\n".join([f"{i+1}. {spread['name']} - {spread['description']}" 
                                for i, spread in enumerate(spreads.values())])
        
        prompt = f"""用户选择了{topic_info.get('name', '未知')}主题。现在要让用户选择牌阵类型：

{spread_list}

请生成一段话来：
1. 根据用户选择的主题推荐合适的牌阵
2. 解释不同牌阵的特点
3. 让用户选择喜欢的牌阵
4. 保持鼓励和期待的语气"""
        
        return call_tarot_llm(prompt)
    
    def post(self, shared, prep_res, exec_res):
        shared["user_session"]["conversation_history"].append({
            "step": "spread_selection_guide",
            "message": exec_res,
            "available_spreads": list(prep_res["spreads"].keys()),
            "timestamp": "now"
        })
        
        shared["user_session"]["current_step"] = "waiting_spread"
        return "waiting_spread"

class ProcessSpreadNode(Node):
    """处理用户选择的牌阵"""
    
    def prep(self, shared):
        selected_spread = shared.get("user_input", {}).get("selected_spread")
        spreads = get_spreads()
        return {
            "selected_spread": selected_spread,
            "spreads": spreads
        }
    
    def exec(self, prep_res):
        selected_spread = prep_res["selected_spread"]
        spreads = prep_res["spreads"]
        
        if selected_spread not in spreads:
            return call_tarot_llm(f"请从以下牌阵中选择：{list(spreads.keys())}")
        
        spread_info = spreads[selected_spread]
        prompt = f"""用户选择了{spread_info['name']}牌阵。请：
1. 确认用户的选择
2. 说明这个牌阵的特点
3. 引导用户准备抽牌（深呼吸、集中注意力等）
4. 营造神秘而不紧张的氛围"""
        
        return call_tarot_llm(prompt)
    
    def post(self, shared, prep_res, exec_res):
        if prep_res["selected_spread"] in prep_res["spreads"]:
            shared["divination"]["spread_type"] = prep_res["selected_spread"]
            shared["user_session"]["current_step"] = "drawing_cards"
            next_action = "drawing_cards"
        else:
            next_action = "spread_selection"
        
        shared["user_session"]["conversation_history"].append({
            "step": "spread_confirmed",
            "message": exec_res,
            "selected_spread": prep_res["selected_spread"],
            "timestamp": "now"
        })
        
        return next_action

class CardDrawingNode(Node):
    """抽牌节点 - 模拟抽牌过程"""
    
    def prep(self, shared):
        spread_type = shared.get("divination", {}).get("spread_type")
        topic = shared.get("divination", {}).get("topic")
        return {
            "spread_type": spread_type,
            "topic": topic
        }
    
    def exec(self, prep_res):
        # 模拟抽牌过程
        spread_type = prep_res["spread_type"]
        draw_result = simulate_draw_process(spread_type)
        
        # 生成抽牌过程的描述
        prompt = f"""用户选择了{draw_result['spread_name']}，现在已经抽取了塔罗牌。

抽牌结果：
{draw_result['summary']}

请作为塔罗占卜师：
1. 营造神秘的抽牌氛围
2. 公布抽到的牌
3. 表达对结果的初步感受
4. 准备进入解读环节
5. 保持期待和鼓励的语气"""
        
        return {
            "draw_result": draw_result,
            "message": call_tarot_llm(prompt)
        }
    
    def post(self, shared, prep_res, exec_res):
        # 存储抽牌结果
        draw_result = exec_res["draw_result"]
        shared["divination"]["drawn_cards"] = draw_result["drawn_cards"]
        
        shared["user_session"]["conversation_history"].append({
            "step": "cards_drawn",
            "message": exec_res["message"],
            "drawn_cards": draw_result["drawn_cards"],
            "timestamp": "now"
        })
        
        shared["user_session"]["current_step"] = "interpretation"
        return "interpretation"

class InterpretationNode(Node):
    """解读节点 - 基于抽到的牌和主题提供解读"""
    
    def prep(self, shared):
        divination = shared.get("divination", {})
        return {
            "topic": divination.get("topic"),
            "spread_type": divination.get("spread_type"),
            "drawn_cards": divination.get("drawn_cards", [])
        }
    
    def exec(self, prep_res):
        topic = prep_res["topic"]
        drawn_cards = prep_res["drawn_cards"]
        
        # 构建牌面信息
        cards_info = []
        for card in drawn_cards:
            card_desc = f"""
{card['emoji']} {card['name']}（{card['orientation']}) - {card['position']}
含义：{card['current_meaning']}
关键词：{', '.join(card['keywords'])}"""
            cards_info.append(card_desc)
        
        cards_text = "\n".join(cards_info)
        
        prompt = f"""现在要为{topic}主题进行塔罗牌解读。抽到的牌是：

{cards_text}

请作为塔罗占卜师星月：
1. 结合抽到的牌和{topic}主题进行深入解读
2. 解释牌面之间的关联和整体含义
3. 针对{topic}给出具体的指导建议
4. 保持积极正面的解读角度
5. 语言风格要友好轻松，避免过于严肃
6. 控制在200字左右"""
        
        return call_tarot_llm(prompt)
    
    def post(self, shared, prep_res, exec_res):
        # 存储解读结果
        shared["divination"]["interpretation"] = exec_res
        
        shared["user_session"]["conversation_history"].append({
            "step": "interpretation",
            "message": exec_res,
            "timestamp": "now"
        })
        
        shared["user_session"]["current_step"] = "advice"
        return "advice"

class AdviceNode(Node):
    """建议节点 - 给出积极正面的建议和鼓励"""
    
    def prep(self, shared):
        divination = shared.get("divination", {})
        return {
            "topic": divination.get("topic"),
            "interpretation": divination.get("interpretation"),
            "drawn_cards": divination.get("drawn_cards", [])
        }
    
    def exec(self, prep_res):
        topic = prep_res["topic"]
        interpretation = prep_res["interpretation"]
        
        prompt = f"""基于刚才对{topic}主题的塔罗解读：
{interpretation}

请作为塔罗占卜师星月：
1. 给出具体可行的建议和指导
2. 提供积极正面的鼓励话语
3. 帮助用户建立信心和希望
4. 提醒用户塔罗是启发工具，最终还是要靠自己的努力
5. 以温暖的祝福结束
6. 控制在120字左右"""
        
        return call_tarot_llm(prompt)
    
    def post(self, shared, prep_res, exec_res):
        # 存储建议
        shared["divination"]["advice"] = exec_res
        
        shared["user_session"]["conversation_history"].append({
            "step": "advice",
            "message": exec_res,
            "timestamp": "now"
        })
        
        # 标记占卜完成
        shared["user_session"]["current_step"] = "completed"
        shared["divination"]["status"] = "completed"
        
        return "completed"