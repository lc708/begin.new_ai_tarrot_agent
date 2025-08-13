import os
from typing import Optional, List, Dict, Any
import dotenv

dotenv.load_dotenv()

def call_llm(prompt: str, provider: Optional[str] = None) -> str:
    """
    Call LLM with support for multiple providers.
    
    Args:
        prompt: The prompt to send to the LLM
        provider: LLM provider to use ('openai', 'gemini', 'deepseek'). 
                 If None, uses LLM_PROVIDER env var or defaults to 'openai'
    
    Returns:
        The LLM response as a string
    """
    # Determine provider
    if provider is None:
        provider = os.getenv("LLM_PROVIDER", "openai").lower()
    
    if provider == "openai":
        from openai import OpenAI
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        client = OpenAI(api_key=api_key)
        model = os.getenv("OPENAI_MODEL", "gpt-5-mini")
        
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    
    elif provider == "gemini":
        try:
            import google.generativeai as genai
        except ImportError:
            raise ImportError("Please install google-generativeai: pip install google-generativeai")
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-2.5-flash"))
        response = model.generate_content(prompt)
        return response.text
    
    elif provider == "deepseek":
        from openai import OpenAI
        api_key = os.getenv("DEEPSEEK_API_KEY")
        if not api_key:
            raise ValueError("DEEPSEEK_API_KEY not found in environment variables")
        
        # DeepSeek uses OpenAI-compatible API
        client = OpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com/v1"
        )
        model = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
        
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    
    else:
        raise ValueError(f"Unsupported provider: {provider}. Choose from: openai, gemini, deepseek")

def call_llm_with_system(system_message: str, user_message: str, provider: Optional[str] = None, temperature: float = 0.7) -> str:
    """
    使用系统消息和用户消息调用LLM
    
    Args:
        system_message (str): 系统提示，定义角色和行为
        user_message (str): 用户输入内容
        provider (str): LLM提供商
        temperature (float): 控制输出随机性
        
    Returns:
        str: LLM的回复内容
    """
    # Determine provider
    if provider is None:
        provider = os.getenv("LLM_PROVIDER", "openai").lower()
    
    if provider == "openai":
        from openai import OpenAI
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        client = OpenAI(api_key=api_key)
        model = os.getenv("OPENAI_MODEL", "gpt-5-mini")
        
        # 某些模型（如 gpt-5-mini）不支持自定义 temperature，使用默认值
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ]
        )
        return response.choices[0].message.content
    
    elif provider == "gemini":
        try:
            import google.generativeai as genai
        except ImportError:
            raise ImportError("Please install google-generativeai: pip install google-generativeai")
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            system_instruction=system_message
        )
        response = model.generate_content(user_message)
        return response.text
    
    elif provider == "deepseek":
        from openai import OpenAI
        api_key = os.getenv("DEEPSEEK_API_KEY")
        if not api_key:
            raise ValueError("DEEPSEEK_API_KEY not found in environment variables")
        
        client = OpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com/v1"
        )
        model = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
        
        # DeepSeek 也可能不支持自定义 temperature，使用默认值
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ]
        )
        return response.choices[0].message.content
    
    else:
        raise ValueError(f"Unsupported provider: {provider}. Choose from: openai, gemini, deepseek")

def call_tarot_llm(prompt: str, **kwargs) -> str:
    """
    专门用于塔罗占卜的LLM调用，使用适合的系统提示
    
    Args:
        prompt (str): 占卜相关的提示词
        **kwargs: 传递给call_llm_with_system的其他参数
        
    Returns:
        str: 塔罗占卜师的回复
    """
    system_message = """你是一位友善、幽默的塔罗占卜师🔮，名字叫做"星月"。你的特点是：

1. 语气轻松友好，像朋友聊天一样
2. 会使用适当的emoji来装饰对话 ✨🌟💫
3. 避免过于神秘或严肃的表达
4. 给出积极正面的解读和建议
5. 适当使用网络流行语，但不过度
6. 每次回复控制在150字以内，简洁有趣
7. 用中文回复，语气温暖亲切

请记住：塔罗占卜是为了给人们带来思考和启发，而不是预测绝对的未来。"""
    
    return call_llm_with_system(system_message, prompt, **kwargs)

if __name__ == "__main__":
    print("=== LLM调用测试 ===\n")
    
    # 测试基本调用
    print("1. 基本调用测试:")
    test_prompt = "你好，请简单介绍一下自己"
    try:
        result = call_llm(test_prompt)
        print(f"结果: {result}\n")
    except Exception as e:
        print(f"错误: {e}\n")
    
    # 测试塔罗专用调用
    print("2. 塔罗占卜师调用测试:")
    tarot_prompt = "请向用户打招呼，介绍你是塔罗占卜师"
    try:
        tarot_result = call_tarot_llm(tarot_prompt)
        print(f"塔罗占卜师回复: {tarot_result}\n")
    except Exception as e:
        print(f"错误: {e}\n")
    
    # 测试系统消息调用
    print("3. 系统消息调用测试:")
    system_msg = "你是一个简洁的助手，只用一句话回答问题"
    user_msg = "什么是塔罗牌？"
    try:
        system_result = call_llm_with_system(system_msg, user_msg)
        print(f"系统消息回复: {system_result}")
    except Exception as e:
        print(f"错误: {e}")
