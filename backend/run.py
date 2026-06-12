"""
run.py — Entry Point for the Flask Server
============================================

HOW TO USE:
  Open PowerShell, navigate to the backend folder, then run:

    cd "e:\\Programming Files\\C programs and Files\\inventory-management\\backend"
    .\\venv\\Scripts\\activate
    python run.py

  The server starts at: http://localhost:5000
  Health check: http://localhost:5000/api/v1/health

WHAT THIS FILE DOES:
  1. Imports the create_app function from app/__init__.py
  2. Creates the Flask application
  3. Starts the development server

WHY A SEPARATE run.py?
  - Keeps app creation logic separate from server startup
  - Tests can import create_app() without starting the server
  - Industry standard pattern
"""

from app import create_app

# Create the Flask application using the Application Factory
app = create_app()

if __name__ == "__main__":
    """
    __name__ == "__main__" means:
      "Only run this code if run.py is executed directly"
      "Don't run it if run.py is imported by another file"

    This is a Python convention. You'll see it in every Python project.
    """
    app.run(
        host=app.config.get("FLASK_HOST", "0.0.0.0"),
        port=app.config.get("FLASK_PORT", 5000),
        debug=app.config.get("FLASK_DEBUG", True)
    )
