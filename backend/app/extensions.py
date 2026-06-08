from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

# Created here but NOT tied to any app yet
# They get connected to the app in create_app()
db = SQLAlchemy()
migrate = Migrate()
cors = CORS()