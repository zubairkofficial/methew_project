import jwt
import datetime
import os
import dotenv

dotenv.load_dotenv()


def generate_token(user):
    secret_key = "your_secret_key_here"
    payload = {
        "id": user["id"],
        "email": user["email"],
        "exp": datetime.datetime() + datetime.timedelta(hours=1),
    }
    token = jwt.encode(payload, os.environ["SECRET_KEY"], algorithm="HS256")
    return token
