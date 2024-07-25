import getpass
import os
import dotenv
from fastapi import FastAPI
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from models import ChatBotMessage
dotenv.load_dotenv()
langchain_app =  FastAPI()

openai_api_key = os.environ["OPENAI_API_KEY"]
model = os.environ["MODEL"]
open_ai_model = ChatOpenAI(model=model, api_key=openai_api_key)

@langchain_app.post('/chatbot/')
async def get_chatbot_response(message: ChatBotMessage,):
    pass
