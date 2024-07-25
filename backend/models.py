from pydantic import BaseModel, EmailStr
from itsdangerous import URLSafeTimedSerializer
from fastapi.security import OAuth2PasswordBearer

class User(BaseModel):
    email: EmailStr
    password: str


class ModelDetailBase(BaseModel):
    gpt_key: str
    crm_key: str
    model_name: str
    user_id: str


class TokenBase(BaseModel):
    access_token: str
    token_type: str


class ChatBotMessage(BaseModel):
    human_message: str
