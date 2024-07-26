from fastapi import APIRouter
from langchain_community.document_loaders import (
    TextLoader,
    UnstructuredMarkdownLoader,
    UnstructuredExcelLoader,
    Docx2txtLoader,
)
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from utils import ROOT_DIRECTORY, get_env_variable

file_manager_router = APIRouter()
OPENAI_API_KEY = get_env_variable("OPENAI_API_KEY")

embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)


def split_document_content(document):
    """
    Split the content of a document into chunks.
    Args:
        document: The document to split.
    Returns:
        A list of document chunks.
    """
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(document)
    return docs


def load_document(path: str, extension: str, metadata: dict):
    """
    Load a document based on its file extension.
    Args:
        path: Path to the document file.
        extension: File extension of the document.
        metadata: Additional metadata associated with the document.
    Returns:
        The loaded document or None if an error occurs.
    """
    try:
        if extension == ".txt":
            document = TextLoader(path, encoding="utf-8").load()
        elif extension == ".md":
            document = UnstructuredMarkdownLoader(path).load()
        elif extension == ".xlsx":
            document = UnstructuredExcelLoader(path, mode="elements").load()
        elif extension == ".docx":
            document = Docx2txtLoader(path).load()
        else:
            document = TextLoader(path, encoding="utf-8").load()
    except UnicodeDecodeError as e:
        print(f"Unicode decode error: {e}")
        document = None
    except Exception as e:
        print(f"An error occurred: {e}")
        document = None

    return document
