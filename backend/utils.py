import dotenv

dotenv.load_dotenv()

def get_env_variable(env: str)->str:
    return dotenv.get_key(key_to_get=env, dotenv_path="./.env")