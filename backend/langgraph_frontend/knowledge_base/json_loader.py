import json
import sys
import os

# Add the parent directory to sys.path

class KnowledgeLoader:
    def __init__(self, json_path):
        
        sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
        self.json_path = json_path
        
    def load(self):
        """
        Load the JSON knowledge data.
        """
        with open(self.json_path, 'r') as f:
            data = json.load(f)
        documents = [{"id": key, "content": value} for key, value in data.get("kb_article", {}).items()]
        return documents
