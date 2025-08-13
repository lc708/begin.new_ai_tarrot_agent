"""
随机抽牌工具
模拟塔罗占卜中的抽牌过程
"""

import random
from typing import List, Dict, Any, Optional
from .tarot_cards import get_all_cards, get_spread_by_type, get_card_names

def draw_cards(spread_type: str, seed: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    根据牌阵类型随机抽取塔罗牌
    
    Args:
        spread_type: 牌阵类型 ('single' 或 'past_present_future')
        seed: 可选的随机种子，用于测试时保证结果一致性
    
    Returns:
        抽到的牌列表，每张牌包含牌面信息和位置信息
    """
    if seed is not None:
        random.seed(seed)
    
    # 获取牌阵信息
    spread_info = get_spread_by_type(spread_type)
    if not spread_info:
        raise ValueError(f"未知的牌阵类型: {spread_type}")
    
    # 获取所有塔罗牌
    all_cards = get_all_cards()
    card_names = get_card_names()
    
    # 随机抽取指定数量的牌
    card_count = spread_info["card_count"]
    positions = spread_info["positions"]
    
    # 确保不会抽到重复的牌
    selected_card_names = random.sample(card_names, card_count)
    
    # 构建结果
    drawn_cards = []
    for i, card_name in enumerate(selected_card_names):
        card_info = all_cards[card_name].copy()
        card_info["position"] = positions[i]
        card_info["position_index"] = i
        
        # 随机决定正位还是逆位（50%概率）
        is_reversed = random.choice([True, False])
        card_info["is_reversed"] = is_reversed
        
        # 根据正逆位选择对应的含义
        if is_reversed:
            card_info["current_meaning"] = card_info["reversed_meaning"]
            card_info["orientation"] = "逆位"
        else:
            card_info["current_meaning"] = card_info["upright_meaning"]
            card_info["orientation"] = "正位"
            
        drawn_cards.append(card_info)
    
    return drawn_cards

def get_card_summary(card: Dict[str, Any]) -> str:
    """
    获取单张牌的简要描述
    
    Args:
        card: 塔罗牌信息字典
    
    Returns:
        牌的简要描述字符串
    """
    emoji = card.get("emoji", "🎴")
    name = card["name"]
    orientation = card["orientation"]
    position = card.get("position", "")
    
    summary = f"{emoji} {name}（{orientation}）"
    if position:
        summary += f" - {position}"
    
    return summary

def get_draw_summary(drawn_cards: List[Dict[str, Any]]) -> str:
    """
    获取整个抽牌结果的摘要
    
    Args:
        drawn_cards: 抽到的牌列表
    
    Returns:
        抽牌结果摘要
    """
    if not drawn_cards:
        return "没有抽到任何牌"
    
    if len(drawn_cards) == 1:
        return f"你抽到了：{get_card_summary(drawn_cards[0])}"
    
    summaries = [get_card_summary(card) for card in drawn_cards]
    return f"你抽到了：\n" + "\n".join(f"{i+1}. {summary}" for i, summary in enumerate(summaries))

def simulate_draw_process(spread_type: str) -> Dict[str, Any]:
    """
    模拟完整的抽牌过程，包括抽牌动作和结果
    
    Args:
        spread_type: 牌阵类型
    
    Returns:
        包含抽牌过程和结果的字典
    """
    spread_info = get_spread_by_type(spread_type)
    if not spread_info:
        raise ValueError(f"未知的牌阵类型: {spread_type}")
    
    # 抽取塔罗牌
    drawn_cards = draw_cards(spread_type)
    
    # 生成抽牌过程描述
    card_count = spread_info["card_count"]
    spread_name = spread_info["name"]
    
    process_description = f"正在为你进行{spread_name}占卜...\n"
    process_description += f"请集中注意力，深呼吸...\n"
    process_description += f"现在开始抽取{card_count}张牌...\n\n"
    
    return {
        "spread_type": spread_type,
        "spread_name": spread_name,
        "process_description": process_description,
        "drawn_cards": drawn_cards,
        "summary": get_draw_summary(drawn_cards)
    }

# 为了兼容性，保留原来的函数名
def random_draw_cards(spread_type: str, seed: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    随机抽牌的别名函数（向后兼容）
    """
    return draw_cards(spread_type, seed)

if __name__ == "__main__":
    # 测试抽牌功能
    print("=== 塔罗抽牌测试 ===\n")
    
    # 测试单张牌抽取
    print("1. 单张牌占卜测试:")
    single_result = simulate_draw_process("single")
    print(single_result["process_description"])
    print(single_result["summary"])
    print()
    
    # 测试三张牌抽取
    print("2. 过去-现在-未来占卜测试:")
    three_card_result = simulate_draw_process("past_present_future")
    print(three_card_result["process_description"])
    print(three_card_result["summary"])
    print()
    
    # 测试固定种子的抽牌（确保结果一致性）
    print("3. 固定种子抽牌测试:")
    fixed_cards_1 = draw_cards("single", seed=42)
    fixed_cards_2 = draw_cards("single", seed=42)
    print(f"种子42第一次: {get_card_summary(fixed_cards_1[0])}")
    print(f"种子42第二次: {get_card_summary(fixed_cards_2[0])}")
    print(f"结果一致: {fixed_cards_1[0]['id'] == fixed_cards_2[0]['id']}")

