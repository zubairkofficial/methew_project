from passlib.context import CryptContext
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from db import engine, Base, User, ModelDetail, get_db
from auth import  generate_token
from chatbot.langchain_model import langchain_app
from fastapi.middleware.cors import CORSMiddleware
import models
import uvicorn


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(langchain_app, prefix="/api")

def hash_password(password: str) -> str:
    """
    Hash a plain text password.
    Args:
        password (str): The plain text password.
    Returns:
        str: The hashed password.
    """
    context = CryptContext(schemes=["argon2", "bcrypt"])
    return context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    Args:
        plain_password (str): The plain text password.
        hashed_password (str): The hashed password.
    Returns:
        bool: True if the password matches, False otherwise.
    """
    context = CryptContext(schemes=["argon2", "bcrypt"])
    return context.verify(plain_password, hashed_password)


@app.post("/login/")
def login(user: models.User, db: Session = Depends(get_db)):
    """
    Authenticate a user and return a token if successful.
    Args:
        user (models.User): The user credentials.
        db (Session): The database session.
    Returns:
        dict: A token and user information if authentication is successful.
    Raises:
        HTTPException: If the credentials are invalid.
    """
    active_user = db.query(User).filter(User.email == user.email).first()
    if active_user and verify_password(user.password, active_user.password):
        token = generate_token(active_user)
        return {
            "token": token,
            "user": {
                "email": active_user.email,
                "name": active_user.name,
                "user_id": active_user.id,
            },
        }
    else:
        raise HTTPException(status_code=400, detail="invalid credentials")


@app.get("/setting/get-setting-value/{user_id}")
def get_setting_value(user_id: str, db: Session = Depends(get_db)):
    """
    Retrieve model settings for a given user.
    Args:
        user_id (str): The ID of the user.
        db (Session): The database session.
    Returns:
        dict: The model settings if found.
    Raises:
        HTTPException: If the data is not found.
    """
    setting_params = (
        db.query(ModelDetail).filter(ModelDetail.user_id == user_id).first()
    )
    if setting_params:
        return {
            "gpt_key": setting_params.gpt_key,
            "crm_key": setting_params.crm_key,
            "model_name": setting_params.model_name,
        }
    else:
        raise HTTPException(status_code=400, detail="Data not found")


@app.post("/setting/update-values")
def set_model_values(
    modelDetail: models.ModelDetailBase, db: Session = Depends(get_db)):
    """
    Update or create model details for a user.
    Args:
        modelDetail (models.ModelDetailBase): The model detail data.
        db (Session): The database session.
    Returns:
        ModelDetail: The updated or newly created model detail record.
    """
    user_in_db = (
        db.query(ModelDetail).filter(ModelDetail.user_id == modelDetail.user_id).first()
    )
    if user_in_db:
        user_in_db.gpt_key = modelDetail.gpt_key
        user_in_db.crm_key = modelDetail.crm_key
        user_in_db.model_name = modelDetail.model_name
        db.commit()
        db.refresh(user_in_db)
        return user_in_db
    else:
        data_model = ModelDetail(
            gpt_key=modelDetail.gpt_key,
            crm_key=modelDetail.crm_key,
            model_name=modelDetail.model_name,
            user_id=modelDetail.user_id,
        )
        db.add(data_model)
        db.commit()
        db.refresh(data_model)
        return data_model


if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, log_level="info")
