import os
from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from app.config import Config

frontend_url = os.environ.get("FRONTEND_URL")

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, supports_credentials=True, origins=frontend_url)

Config.init_cloudinary()

login_manager = LoginManager(app)
login_manager.init_app(app)

from app import routes
from app import user
from app import utils
from app import errors
from app import cloudinary
