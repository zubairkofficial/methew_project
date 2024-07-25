from sqlalchemy.orm import Session
import jwt
from fastapi import Depends, APIRouter, HTTPException
from fastapi.security import OAuth2PasswordBearer
from db import get_db
import secrets
import base64
import os
from utils import get_env_variable
import datetime


def generate_token(user):
    """
    Generate a JWT token for a user.
    Args:
        user (User): The user object containing the user's ID and email.
    Returns:
        str: The generated JWT token.
    The token payload includes:
        - id: The user's ID.
        - email: The user's email.
        - exp: The current datetime (indicating the expiration time).
    """
    SECRET_KEY = get_env_variable("SECRET_KEY")
    ALGORITHM = get_env_variable("ALGORITHM")
    payload = {"id": user.id, "email": user.email, "exp": datetime.datetime.now()}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def generate_random_string(n: int) -> str:
    """
    Generate a random string of specified length.
    Args:
        n (int): The length of the random string.
    Returns:
        str: The generated random string.
    """
    random_bytes = secrets.token_bytes(n)
    random_string = base64.urlsafe_b64encode(random_bytes).decode("utf-8")
    return random_string[:n]


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter()
SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = os.environ["ALGORITHM"]


def get_user_id(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> str:
    """
    Retrieve user ID from JWT token.
    Args:
        db (Session): The database session.
        token (str): The JWT token.
    Returns:
        str: The user ID extracted from the token.
    Raises:
        HTTPException: If the token is invalid or the user ID is not found.
    """
    if isinstance(token, str):
        token = token.encode("utf-8")

    payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )
    return user_id
