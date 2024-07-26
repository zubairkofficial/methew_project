import dotenv
import os
dotenv.load_dotenv()

ROOT_DIRECTORY = os.getcwd()

def get_env_variable(env: str)->str:
    return dotenv.get_key(key_to_get=env, dotenv_path="./.env")