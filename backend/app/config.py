import os
from dotenv import load_dotenv
import cloudinary

load_dotenv()


class Config(object):
    # база данных
    SECRET_KEY = os.environ.get("SECRET_KEY") or "abcde"
    DB_SERVER = os.environ.get("DB_SERVER") or "localhost"
    DB_USER = os.environ.get("DB_USER")
    DB_PASSWORD = os.environ.get("DB_PASSWORD")
    DB_NAME = os.environ.get("DB_NAME")
    DB_PORT = os.environ.get("DB_PORT") or "5432"

    # настройки сессий
    SESSION_TYPE = "filesystem"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = True  # должно быть True для HTTPS
    SESSION_COOKIE_SAMESITE = "None"  # разрешает куки между разными доменами

    # настройки cloudinary
    CLOUD_NAME = os.environ.get("CLOUD_NAME")
    CLOUD_API_KEY = os.environ.get("CLOUD_API_KEY")
    CLOUD_API_SECRET = os.environ.get("CLOUD_API_SECRET")

    @staticmethod
    def init_cloudinary():
        cloudinary.config(
            cloud_name=Config.CLOUD_NAME,
            api_key=Config.CLOUD_API_KEY,
            api_secret=Config.CLOUD_API_SECRET,
            secure=True,
        )
