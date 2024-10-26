from app.routes.openai import openai_bp
from app.routes.users import users_bp
from app.routes.start import start_bp

def register_routes(app):
    app.register_blueprint(openai_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(start_bp)