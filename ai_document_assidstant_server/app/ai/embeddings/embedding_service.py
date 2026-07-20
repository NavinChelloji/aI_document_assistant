from langchain_huggingface import HuggingFaceEmbeddings

class EmbeddingService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            # Defaulting to all-MiniLM-L6-v2 as per Tech Stack specs
            cls._instance.embeddings = HuggingFaceEmbeddings(
                model_name="all-MiniLM-L6-v2"
            )
        return cls._instance

    def get_embeddings(self):
        return self.embeddings

def get_embedding_model():
    return EmbeddingService().get_embeddings()
