from urllib import response
from fastapi_users.password import PasswordHelper
from passlib.context import CryptContext
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from db import engine, Base, User, ModelDetail, UserToken, get_db
from auth import  generate_random_string
# from utils import generate_token
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
Base.metadata.create_all(bind=engine)


def hash_password(password: str) -> str:
    context = CryptContext(schemes=["argon2", "bcrypt"])
    return context.hash(password)


def verify_password(plain_password: str, hashed_password) -> bool:
    context = CryptContext(schemes=["argon2", "bcrypt"])
    return context.verify(plain_password, hashed_password)


@app.post("/login/")
def login(user: models.User, db: Session = Depends(get_db)):
    active_user = db.query(User).filter(User.email == user.email).first()
    if active_user and verify_password(user.password, active_user.password): 
        token = generate_random_string(40)
        return {
            "token": token,
            "user": {
                "emali": active_user.email,
                "name": active_user.name,
                "user_id": active_user.id
            }
        }
    else:
        raise HTTPException(status_code=400, detail="invalid credentials")

@app.post("/setting/update-values")
def set_model_values(
    modelDetail: models.ModelDetailBase, db: Session = Depends(get_db)):
    user_in_db = db.query(ModelDetail).filter(ModelDetail.user_id == modelDetail.user_id).first()
    if user_in_db:
        print(f"User in DB")
        user_in_db.gpt_key = modelDetail.gpt_key
        user_in_db.crm_key = modelDetail.crm_key
        user_in_db.model_name = modelDetail.model_name
        db.commit()
        db.refresh(user_in_db)
        return user_in_db
    else:
        print("New Data")
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
