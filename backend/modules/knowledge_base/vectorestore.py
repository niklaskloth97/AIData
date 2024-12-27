from langchain_community.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

class VectorStore:
    def __init__(self, persist_directory="./chroma_db"):
        self.persist_directory = persist_directory
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        self.embed_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vectorstore = None

    def initialize(self, documents):
        """
        Initialize the Chroma vector store with documents.
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
        Load a persisted Chroma vector store.
        """
        self.vectorstore = Chroma(
            collection_name="local-rag",
            persist_directory=self.persist_directory
        )

    def as_retriever(self, search_kwargs=None):
        """
        Expose the Chroma retriever interface.
        """
        if self.vectorstore is None:
            raise ValueError("VectorStore must be initialized or loaded before use.")
        return self.vectorstore.as_retriever(
            search_kwargs=search_kwargs,
            embedding=self.embed_model
        )
