from langchain_community.llms import Ollama
from app.config.settings import get_settings

settings = get_settings()

def get_llm(model_name: str = "qwen:latest"):
    """
    Returns an instance of the Ollama LLM wrapper.
    Ensure Ollama is running locally and the model is pulled.
    """
    return Ollama(
        base_url=settings.OLLAMA_HOST,
        model=model_name
    )
