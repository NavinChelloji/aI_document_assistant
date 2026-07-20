import chromadb
from chromadb.config import Settings as ChromaSettings
from app.config.settings import get_settings

settings = get_settings()

class ChromaDBClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ChromaDBClient, cls).__new__(cls)
            # Initialize the Chroma client pointing to local path
            cls._instance.client = chromadb.PersistentClient(
                path=settings.CHROMA_PATH,
                settings=ChromaSettings(anonymized_telemetry=False)
            )
        return cls._instance

    def get_client(self):
        return self.client

def get_chroma_client():
    return ChromaDBClient().get_client()
