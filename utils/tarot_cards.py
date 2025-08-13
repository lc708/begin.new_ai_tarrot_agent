"""
塔罗牌数据管理工具
提供所有塔罗牌的基本信息，包括名称、含义、关键词等
"""

# 主要阿卡纳塔罗牌数据
MAJOR_ARCANA = {
    "the_fool": {
        "id": "the_fool",
        "name": "愚者",
        "number": 0,
        "keywords": ["新开始", "冒险", "纯真", "自由"],
        "upright_meaning": "新的开始，充满无限可能。保持开放的心态，勇敢踏出第一步。",
        "reversed_meaning": "鲁莽行事，缺乏计划。需要更加谨慎思考。",
        "emoji": "🌱"
    },
    "the_magician": {
        "id": "the_magician",
        "name": "魔术师",
        "number": 1,
        "keywords": ["技能", "意志力", "专注", "创造"],
        "upright_meaning": "拥有实现目标的技能和意志力。是时候将想法付诸行动了。",
        "reversed_meaning": "能力被误用，缺乏专注。需要重新调整方向。",
        "emoji": "✨"
    },
    "the_high_priestess": {
        "id": "the_high_priestess", 
        "name": "女祭司",
        "number": 2,
        "keywords": ["直觉", "智慧", "神秘", "内在"],
        "upright_meaning": "相信你的直觉和内在智慧。答案就在你心中。",
        "reversed_meaning": "忽视直觉，过度理性分析。需要平衡理性与感性。",
        "emoji": "🌙"
    },
    "the_empress": {
        "id": "the_empress",
        "name": "皇后",
        "number": 3,
        "keywords": ["丰盛", "创造力", "养育", "自然"],
        "upright_meaning": "创造力和丰盛的象征。生活中会有美好的收获。",
        "reversed_meaning": "创造力受阻，过度依赖他人。需要重拾自主性。",
        "emoji": "👑"
    },
    "the_emperor": {
        "id": "the_emperor",
        "name": "皇帝", 
        "number": 4,
        "keywords": ["权威", "结构", "控制", "稳定"],
        "upright_meaning": "建立秩序和结构的时候。用理性和权威解决问题。",
        "reversed_meaning": "过度控制，缺乏灵活性。需要学会放手。",
        "emoji": "⚡"
    },
    "the_hierophant": {
        "id": "the_hierophant",
        "name": "教皇",
        "number": 5,
        "keywords": ["传统", "学习", "指导", "精神"],
        "upright_meaning": "向智者学习，遵循传统智慧。寻求精神指导。",
        "reversed_meaning": "过度依赖权威，缺乏独立思考。需要培养自主判断。",
        "emoji": "📚"
    },
    "the_lovers": {
        "id": "the_lovers",
        "name": "恋人",
        "number": 6,
        "keywords": ["爱情", "选择", "和谐", "关系"],
        "upright_meaning": "爱情和关系中的和谐。重要的选择需要用心决定。",
        "reversed_meaning": "关系不和谐，选择困难。需要重新审视价值观。",
        "emoji": "💕"
    },
    "the_chariot": {
        "id": "the_chariot",
        "name": "战车",
        "number": 7,
        "keywords": ["胜利", "意志力", "控制", "前进"],
        "upright_meaning": "凭借意志力克服困难。保持专注，胜利在望。",
        "reversed_meaning": "缺乏方向，失去控制。需要重新找到前进的动力。",
        "emoji": "🏆"
    },
    "strength": {
        "id": "strength",
        "name": "力量",
        "number": 8,
        "keywords": ["内在力量", "勇气", "温柔", "控制"],
        "upright_meaning": "用温柔的力量征服困难。真正的力量来自内心。",
        "reversed_meaning": "缺乏自信，内心恐惧。需要重建内在力量。",
        "emoji": "💪"
    },
    "the_hermit": {
        "id": "the_hermit",
        "name": "隐者",
        "number": 9,
        "keywords": ["内省", "智慧", "指导", "孤独"],
        "upright_meaning": "向内寻找答案的时候。独处会带来智慧。",
        "reversed_meaning": "过度孤立，拒绝外界帮助。需要重新连接他人。",
        "emoji": "🔍"
    },
    "wheel_of_fortune": {
        "id": "wheel_of_fortune",
        "name": "命运之轮",
        "number": 10,
        "keywords": ["命运", "变化", "循环", "机会"],
        "upright_meaning": "命运的转机即将到来。拥抱变化，抓住机会。",
        "reversed_meaning": "运气不佳，抗拒变化。需要主动适应环境。",
        "emoji": "🎡"
    },
    "justice": {
        "id": "justice",
        "name": "正义",
        "number": 11,
        "keywords": ["公正", "平衡", "真相", "因果"],
        "upright_meaning": "追求公正和平衡。真相终将浮现。",
        "reversed_meaning": "不公正，失去平衡。需要重新审视自己的行为。",
        "emoji": "⚖️"
    },
    "the_hanged_man": {
        "id": "the_hanged_man",
        "name": "倒吊人",
        "number": 12,
        "keywords": ["牺牲", "等待", "新视角", "放手"],
        "upright_meaning": "换个角度看问题。有时停下来等待是最好的选择。",
        "reversed_meaning": "无谓的牺牲，拒绝改变。需要重新评估现状。",
        "emoji": "🔄"
    },
    "death": {
        "id": "death",
        "name": "死神",
        "number": 13,
        "keywords": ["转变", "结束", "重生", "放下"],
        "upright_meaning": "旧的结束，新的开始。拥抱转变带来的机会。",
        "reversed_meaning": "抗拒改变，停滞不前。需要勇敢面对转变。",
        "emoji": "🦋"
    },
    "temperance": {
        "id": "temperance",
        "name": "节制",
        "number": 14,
        "keywords": ["平衡", "耐心", "调和", "中庸"],
        "upright_meaning": "找到生活的平衡点。耐心调和不同的元素。",
        "reversed_meaning": "缺乏耐心，失去平衡。需要重新调整生活节奏。",
        "emoji": "🌈"
    },
    "the_devil": {
        "id": "the_devil",
        "name": "恶魔",
        "number": 15,
        "keywords": ["束缚", "诱惑", "物质", "依赖"],
        "upright_meaning": "意识到束缚你的东西。是时候打破不健康的模式了。",
        "reversed_meaning": "挣脱束缚，重获自由。正在摆脱不良习惯。",
        "emoji": "⛓️"
    },
    "the_tower": {
        "id": "the_tower",
        "name": "塔",
        "number": 16,
        "keywords": ["突变", "毁灭", "启示", "解放"],
        "upright_meaning": "突然的变化带来启示。破旧立新的时机。",
        "reversed_meaning": "避免崩溃，渐进改变。需要主动应对危机。",
        "emoji": "💥"
    },
    "the_star": {
        "id": "the_star",
        "name": "星星",
        "number": 17,
        "keywords": ["希望", "指引", "灵感", "治愈"],
        "upright_meaning": "希望之光照亮前路。保持信念，未来可期。",
        "reversed_meaning": "失去希望，缺乏信心。需要重新找到内在光芒。",
        "emoji": "⭐"
    },
    "the_moon": {
        "id": "the_moon",
        "name": "月亮",
        "number": 18,
        "keywords": ["幻象", "直觉", "恐惧", "潜意识"],
        "upright_meaning": "相信直觉，但要小心幻象。探索内心深处的秘密。",
        "reversed_meaning": "摆脱恐惧，看清真相。理性战胜了迷茫。",
        "emoji": "🌙"
    },
    "the_sun": {
        "id": "the_sun",
        "name": "太阳",
        "number": 19,
        "keywords": ["成功", "喜悦", "活力", "光明"],
        "upright_meaning": "成功和快乐即将到来。充满活力地拥抱生活。",
        "reversed_meaning": "暂时的低迷，缺乏活力。很快就会重见光明。",
        "emoji": "☀️"
    },
    "judgement": {
        "id": "judgement",
        "name": "审判",
        "number": 20,
        "keywords": ["重生", "觉醒", "宽恕", "新生"],
        "upright_meaning": "精神觉醒的时刻。宽恕过去，迎接新生。",
        "reversed_meaning": "逃避责任，拒绝成长。需要勇敢面对过去。",
        "emoji": "📯"
    },
    "the_world": {
        "id": "the_world",
        "name": "世界",
        "number": 21,
        "keywords": ["完成", "成就", "圆满", "旅程"],
        "upright_meaning": "目标达成，旅程圆满。享受成就带来的满足感。",
        "reversed_meaning": "接近完成，需要最后冲刺。不要在终点前放弃。",
        "emoji": "🌍"
    }
}

# 占卜主题
DIVINATION_TOPICS = {
    "love": {
        "name": "爱情",
        "description": "关于爱情、感情关系的占卜",
        "emoji": "💝"
    },
    "career": {
        "name": "事业",
        "description": "关于工作、事业发展的占卜",
        "emoji": "💼"
    },
    "wealth": {
        "name": "财运",
        "description": "关于财富、金钱运势的占卜",
        "emoji": "💰"
    },
    "health": {
        "name": "健康",
        "description": "关于身体健康、精神状态的占卜",
        "emoji": "🌿"
    },
    "general": {
        "name": "综合运势",
        "description": "关于整体运势的综合占卜",
        "emoji": "🔮"
    }
}

# 牌阵类型
SPREAD_TYPES = {
    "single": {
        "name": "单张牌",
        "description": "抽取一张牌进行简单占卜",
        "card_count": 1,
        "positions": ["当前状况"]
    },
    "past_present_future": {
        "name": "过去-现在-未来",
        "description": "三张牌分别代表过去、现在和未来",
        "card_count": 3,
        "positions": ["过去", "现在", "未来"]
    }
}

def get_all_cards():
    """获取所有塔罗牌数据"""
    return MAJOR_ARCANA

def get_card_by_id(card_id):
    """根据ID获取特定塔罗牌"""
    return MAJOR_ARCANA.get(card_id)

def get_card_names():
    """获取所有塔罗牌名称列表"""
    return list(MAJOR_ARCANA.keys())

def get_topics():
    """获取所有占卜主题"""
    return DIVINATION_TOPICS

def get_spreads():
    """获取所有牌阵类型"""
    return SPREAD_TYPES

def get_spread_by_type(spread_type):
    """根据类型获取特定牌阵"""
    return SPREAD_TYPES.get(spread_type)

if __name__ == "__main__":
    # 测试函数
    print("=== 塔罗牌数据测试 ===")
    
    # 测试获取所有牌
    all_cards = get_all_cards()
    print(f"总共有 {len(all_cards)} 张塔罗牌")
    
    # 测试获取特定牌
    fool_card = get_card_by_id("the_fool")
    if fool_card:
        print(f"愚者牌: {fool_card['name']} - {fool_card['upright_meaning']}")
    
    # 测试获取主题
    topics = get_topics()
    print(f"占卜主题: {[topic['name'] for topic in topics.values()]}")
    
    # 测试获取牌阵
    spreads = get_spreads()
    print(f"牌阵类型: {[spread['name'] for spread in spreads.values()]}")

