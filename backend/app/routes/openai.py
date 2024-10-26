from flask import Blueprint, Flask, request, jsonify, current_app
import openai
from langchain_community.llms import OpenAI as LangChainOpenAI
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain

openai_bp = Blueprint('openai', __name__)

# OpenAI Key Loading
@openai_bp.before_request
def load_openai_key():
    openai.api_key = current_app.config.get('OPENAI_API_KEY')


# Define Routes for OpenAI completions
@openai_bp.route('/openai/completion', methods=['POST'])
def call_openai_completion():
    data = request.json
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=100
    )
    return jsonify(response)


# Define Routes for LangChain integration
@openai_bp.route('/openai/langchain', methods=['POST'])
def call_openai_with_langchain():
    data = request.json
    input_text = data.get('input')

    if not input_text:
        return jsonify({'error': 'Input text is required'}), 400

    # LangChain logic
    template = "Create a product description for the following item: {item_name}"
    prompt = PromptTemplate(input_variables=["item_name"], template=template)

    llm = LangChainOpenAI(temperature=0.9)
    chain = LLMChain(llm=llm, prompt=prompt)

    response = chain.run(input_text)

    return jsonify({'response': response})