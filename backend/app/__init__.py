from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from app.config import Config

frontend_url = "http://127.0.0.1:5173"

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=frontend_url)


@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = frontend_url
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, DELETE, PUT"
    return response


app.config.from_object(Config)
Config.init_cloudinary()

login_manager = LoginManager(app)
login_manager.init_app(app)

from app import routes
from app import user
from app import utils
from app import errors
from app import cloudinary
