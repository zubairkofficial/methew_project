from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from typing import Union, Annotated
from sqlalchemy.orm import Session
from fastapi import Depends
from sqlalchemy import ForeignKey, String, Column, Integer

# database_url = "postgresql://:password@localhost/database_name"
database_url = "postgresql://postgres:123456789@localhost:5432/testpos"
engine = create_engine(url=database_url)
SessionLocal = sessionmaker(autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependencies = Annotated[Session, Depends(get_db)]


class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    email = Column(String, index=True, unique=True)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)


class ModelDetail(Base):
    __tablename__ = "ModelDetail"
    id = Column(Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"), nullable=False)
    gpt_key = Column(String, nullable=False, default="132@456")
    crm_key = Column(String, nullable=False, default="132@456")
    model_name = Column(String, nullable=False)


class UserToken(Base):
    __tablename__ = "UserToken"
    id = Column(
        Integer, nullable=False, unique=True, autoincrement=True, primary_key=True
    )
    user_id = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"), nullable=False)
    token = Column(String, nullable=False, unique=True)
