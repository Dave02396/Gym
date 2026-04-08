from flask import Flask
from config import Config
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from db import db
from app.models import role_model, user_model, class_model, booking_model

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app)

from app import routes