import os
from dotenv import load_dotenv

load_dotenv()  # Reads your .env file


class Config:
    """Base configuration shared across all environments."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Saves memory, suppresses warning


class DevelopmentConfig(Config):
    """Configuration for local development."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://postgres:password@localhost:5432/smart_inventory_db'
    )
    SQLALCHEMY_ECHO = True  # Prints every SQL query to terminal (helpful for learning)


class ProductionConfig(Config):
    """Configuration for deployed production server."""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_ECHO = False


# Dictionary so we can select config by name
config_map = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}