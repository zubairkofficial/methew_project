from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends
from sqlalchemy import ForeignKey, String, Column, Integer
import dotenv
from utils import get_env_variable as get_env

dotenv.load_dotenv()
DATABASE_NAME = get_env("DATABASE_NAME")
PORT = get_env("PORT")
USERNAME = get_env("USERNAME")
DATABASE_PASSWORD = get_env("DATABASE_PASSWORD")

DATABASE_URL = f"postgresql://{USERNAME}:{DATABASE_PASSWORD}@localhost:{PORT}/{DATABASE_NAME}"
engine = create_engine(url=DATABASE_URL)
SessionLocal = sessionmaker(autoflush=False, bind=engine)
Base = declarative_base()
Base.metadata.create_all(bind=engine)
def get_db():
    """
    Provides a database session to interact with the database.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependencies = Annotated[Session, Depends(get_db)]

class User(Base):
    """
    Represents a user in the database.
    """
    __tablename__ = "User"
    id = Column(Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    email = Column(String, index=True, unique=True)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)

class ModelDetail(Base):
    """
    Represents model details associated with a user.
    """
    __tablename__ = "ModelDetail"
    id = Column(Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"), nullable=False)
    gpt_key = Column(String, nullable=False, default="132@456")
    crm_key = Column(String, nullable=False, default="132@456")
    model_name = Column(String, nullable=False)

class UserToken(Base):
    """
    Represents a token associated with a user for authentication.
    """
    __tablename__ = "UserToken"
    id = Column(Integer, nullable=False, unique=True, autoincrement=True, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"), nullable=False)
    token = Column(String, nullable=False, unique=True)
