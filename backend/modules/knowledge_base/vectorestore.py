from langchain.vectorstores import Chroma
from langchain.embeddings import SentenceTransformerEmbedding
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os

class VectorStore:
    def __init__(self, persist_directory="./chroma_db"):
        self.persist_directory = persist_directory
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        self.embed_model = SentenceTransformerEmbedding(model_name="all-MiniLM-L6-v2")
        self.vectorstore = None

    def initialize(self, documents):
        """
        Initialize the Chroma vectorstore with documents.
        """
        doc_splits = self.text_splitter.create_documents([doc["content"] for doc in documents])
        self.vectorstore = Chroma.from_documents(
            documents=doc_splits,
            embedding=self.embed_model,
            collection_name="local-rag",
            persist_directory=self.persist_directory
        )
        self.vectorstore.persist()

    def load(self):
        """
        Load a persisted Chroma vectorstore.
        """
        self.vectorstore = Chroma(
            collection_name="local-rag",
            embedding=self.embed_model,
            persist_directory=self.persist_directory
        )

    def search(self, query, top_k=3):
        """
        Perform a similarity search on the vectorstore.
        """
        if not self.vectorstore:
            raise ValueError("Vector store is not initialized or loaded.")
        return self.vectorstore.similarity_search(query, k=top_k)
