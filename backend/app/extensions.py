"""Shared Flask extensions — single source of truth via core.database.db."""

from app.core.database.db import db, ma, migrate

__all__ = ["db", "ma", "migrate"]
