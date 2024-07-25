from typing import Annotated
from sqlalchemy.orm import Session
import jwt
from fastapi import Depends, FastAPI, APIRouter, HTTPException
from fastapi.security import OAuth2PasswordBearer
from db import Depends, get_db, User
import secrets
import base64
import os
import dotenv

dotenv.load_dotenv()

def generate_random_string(n: int):
    random_bytes = secrets.token_bytes(n)
    random_string = base64.urlsafe_b64encode(random_bytes).decode("utf-8")
    return random_string[:n]


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter()
SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = os.environ["ALGORITHM"]


def get_user_id(db: Session = Depends(get_db),
                token: str = Depends(oauth2_scheme)):
    if isinstance(token, str):
        token = token.encode("utf-8")
        print(f"Token if string = {token}")
    print(f"Token if string = {token}")
    payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )
    return user_id
