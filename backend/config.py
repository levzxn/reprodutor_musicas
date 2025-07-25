import os
from dotenv import load_dotenv

load_dotenv()

CONN_STRING = os.getenv("DATABASE_URL")

TORTOISE_CONFIG = {
    "connections": {
        "default": CONN_STRING
    },
    "apps": {
        "models": {
            "models": ["models"], 
            "default_connection": "default",
        }
    },
    "use_tz": True,  
    "timezone": "America/Sao_Paulo",  
}
