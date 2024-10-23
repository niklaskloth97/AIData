from flask import jsonify

def setup_error_handlers(app):

    # Handle 404 errors
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found"}), 404

    # Handle 500 errors
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    # Handle generic exceptions
    @app.errorhandler(Exception)
    def handle_exception(error):
        app.logger.error(f"Unexpected error: {str(error)}")
        return jsonify({"error": "An unexpected error occurred"}), 500
