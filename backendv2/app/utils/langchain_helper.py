from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_community.llms import OpenAI


def generate_with_langchain(input_text):
    # Template for the generation
    template = "Generate a product description for the following item: {item_name}"
    prompt = PromptTemplate(input_variables=["item_name"], template=template)

    # LangChain OpenAI wrapper
    llm = OpenAI(temperature=0.9)
    chain = LLMChain(llm=llm, prompt=prompt)

    # Generate the output
    return chain.run(input_text)
