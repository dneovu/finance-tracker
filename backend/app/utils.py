from app import app
import psycopg


def db_connect():
    con = psycopg.connect(
        host=app.config["DB_SERVER"],
        user=app.config["DB_USER"],
        password=app.config["DB_PASSWORD"],
        dbname=app.config["DB_NAME"],
    )
    cur = con.cursor()
    return con, cur
