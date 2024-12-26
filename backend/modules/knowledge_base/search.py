from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

class EmbeddingSearch:
    def __init__(self, texts):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.texts = texts
        self.embeddings = self.model.encode(texts)
        self.index = self.build_index()

    def build_index(self):
        dimension = self.embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)
        index.add(self.embeddings)
        return index

    def search(self, query, top_k=5):
        query_embedding = self.model.encode([query])
        distances, ids = self.index.search(np.array(query_embedding, dtype=np.float32), k=top_k)
        return [(self.texts[idx], distances[0][i]) for i, idx in enumerate(ids[0])]
