from flask import Flask, request, jsonify
from modules.langgraph_frontend.src.react_agent.graph import query_vectorstore
# Initialize Flask app
app = Flask(__name__)

app = Flask(__name__)

@app.route('/query', methods=['GET'])
def query_knowledge():
    query = request.args.get('query', '')
    results = query_vectorstore(query)
    return jsonify({"query": query, "results": results})

if __name__ == '__main__':
    app.run(debug=True)
