import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    dbname="resturants_db",
)
# cur = conn.cursor()

# cur.execute("""
#     CREATE TABLE IF NOT EXISTS users (
#         id SERIAL PRIMARY KEY,
#         name TEXT NOT NULL,
#         email TEXT UNIQUE NOT NULL,
#         created_at TIMESTAMP DEFAULT NOW()
#     )
# """)
# conn.commit()