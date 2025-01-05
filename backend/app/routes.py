from flask import request
from app import app
import psycopg


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "GET":
        return "Hello, World!"
    elif request.method == "POST":
        return "Hello, World! (POST-запрос)"
    else:
        return "Неизвестный метод запроса"


@app.route("/testdb")
def test_connection():
    con = None
    try:
        con = psycopg.connect(
            host=app.config["DB_SERVER"],
            user=app.config["DB_USER"],
            password=app.config["DB_PASSWORD"],
            dbname=app.config["DB_NAME"],
        )
        cur = con.cursor()
        cur.execute(
            'INSERT INTO "user" ("username", "password", "logo") VALUES (%s, %s, %s)',
            ("test", "test", "test"),
        )
        con.commit()
        ans = cur.execute('SELECT * from "user"').fetchall()
    except Exception as e:
        message = f"Ошибка подключения: {e}"
    else:
        message = ans
    finally:
        if con:
            con.close()
        return message
