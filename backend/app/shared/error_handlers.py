from flask import jsonify
from .response_helpers import error_response


def register_error_handlers(app):
    """Register all global error handlers with the Flask app."""

    @app.errorhandler(400)
    def bad_request(error):
        return error_response("Bad request - invalid data sent", 400)

    @app.errorhandler(404)
    def not_found(error):
        return error_response("Resource not found", 404)

    @app.errorhandler(405)
    def method_not_allowed(error):
        return error_response("HTTP method not allowed for this endpoint", 405)

    @app.errorhandler(500)
    def internal_server_error(error):
        return error_response("Internal server error - please try again", 500)
    