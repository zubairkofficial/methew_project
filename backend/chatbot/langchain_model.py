from fastapi import APIRouter, UploadFile, File
from langchain_postgres import PGVector
from chatbot.langchain_helper import (load_document, split_document_content,
                                      embeddings)
from models import ChatBotMessage
from db import DATABASE_URL
from utils import ROOT_DIRECTORY, get_env_variable
import dotenv
import shutil
import os


dotenv.load_dotenv()
langchain_app = APIRouter()
model = get_env_variable("MODEL")
postgres_connection = DATABASE_URL
collection_name = "doc_collection"


def generate_embeddings(document):
    """
    Generate and store embeddings for the provided document.
    Args:
        document: The document to generate embeddings for.
    """
    PGVector.from_documents(
        embedding=embeddings,
        documents=document,
        connection=postgres_connection,
        use_jsonb=True,
    )


@langchain_app.post("/chatbot/")
async def get_chatbot_response(message: ChatBotMessage):
    """
    Retrieve a chatbot response based on the user's message.
    Args:
        message: The message from the user.
    Returns:
        The chatbot's response.
    """
    VECTORSEARCH = PGVector(
        connection=postgres_connection,
        embeddings=embeddings,
    )
    response = VECTORSEARCH.similarity_search(query=message.human_message, k=1)

    return response


@langchain_app.post("/file/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a file, process it, and generate embeddings.
    Args:
        file: The file to upload.
    Returns:
        A dictionary with the filename and content type.
    """
    file_extension = file.filename.split(".")[-1]
    upload_folder = os.path.join(ROOT_DIRECTORY, "uploads")
    os.makedirs(upload_folder, exist_ok=True)
    uploaded_file = os.path.join(upload_folder, file.filename)
    with open(uploaded_file, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)
    document = load_document(
        path=uploaded_file, extension=file_extension, metadata={"user_id": 1}
    )
    split_document = split_document_content(document)
    generate_embeddings(split_document)
    return {"filename": file.filename, "content_type": file.content_type}
