from app.db import get_connection

def get_user_by_email(email):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (email,))
            return cur.fetchone()
    finally:
        conn.close()

def get_role_by_id(role_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM roles WHERE id = %s", (role_id,))
            return cur.fetchone()
    finally:
        conn.close()

def get_role_by_name(name):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM roles WHERE name = %s", (name,))
            return cur.fetchone()
    finally:
        conn.close()

def create_user(email, password_hash, role_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (email, password_hash, role_id)
                VALUES (%s, %s, %s)
                RETURNING *
                """,
                (email, password_hash, role_id)
            )
            user = cur.fetchone()
            conn.commit()
            return user
    finally:
        conn.close()

def get_user_by_id(user_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            return cur.fetchone()
    finally:
        conn.close()

def update_user_role(email, new_role_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE users 
                SET role_id = %s 
                WHERE email = %s
                RETURNING *
                """,
                (new_role_id, email)
            )
            user = cur.fetchone()
            conn.commit()
            return user
    finally:
        conn.close()
