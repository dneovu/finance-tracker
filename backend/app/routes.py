from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify
from flask_login import login_user, current_user, logout_user
from app.utils import db_connect
from app.user import User
from app import app


@app.errorhandler(400)
def bad_request(error):
    return jsonify({"status": "error", "message": "Bad request"}), 400


@app.errorhandler(404)
def not_found(error):
    return jsonify({"status": "error", "message": "Not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"status": "error", "message": "Internal server error"}), 500


def validate_auth_input(value):
    return len(value) > 5 and len(value) < 21


@app.route("/register", methods=["POST"])
def register():
    if current_user.is_authenticated:
        return jsonify({"status": "error", "message": "User is already logged in"}), 400

    request_data = request.get_json()
    username = request_data.get("username")
    password = request_data.get("password")

    if (
        not username
        or not password
        or not validate_auth_input(username)
        or not validate_auth_input(password)
    ):
        return (
            jsonify(
                {"status": "error", "message": "Invalid username or password length"}
            ),
            400,
        )

    password_hash = generate_password_hash(password)

    try:
        con, cur = db_connect()
        res = cur.execute(
            'SELECT "username" FROM "user" WHERE "username" = %s', (username,)
        ).fetchone()

        if res is not None:
            return jsonify({"status": "error", "message": "User already exists"}), 400

        cur.execute(
            'INSERT INTO "user" ("username", "password") VALUES (%s, %s)',
            (username, password_hash),
        )
        con.commit()

    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"status": "error", "message": "Connection error"}), 500
    else:
        return (
            jsonify({"status": "success", "message": f"User {username} created"}),
            200,
        )
    finally:
        if con:
            con.close()


@app.route("/login", methods=["POST"])
def login():
    if current_user.is_authenticated:
        return jsonify({"status": "error", "message": "User is already logged in"}), 400

    request_data = request.get_json()
    username = request_data.get("username")
    password = request_data.get("password")

    if (
        not username
        or not password
        or not validate_auth_input(username)
        or not validate_auth_input(password)
    ):
        return (
            jsonify(
                {"status": "error", "message": "Invalid username or password length"}
            ),
            400,
        )

    try:
        con, cur = db_connect()
        res = cur.execute(
            'SELECT "id", "username", "password" FROM "user" WHERE "username" = %s',
            (username,),
        ).fetchone()

        if res is None or not check_password_hash(res[2], password):
            return (
                jsonify({"status": "error", "message": "Invalid username or password"}),
                400,
            )

        user = User(res[0], res[1], res[2])
        login_user(user)

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "User logged in",
                    "user": {"username": res[1]},
                }
            ),
            200,
        )
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"status": "error", "message": "Connection error"}), 500
    finally:
        if con:
            con.close()


@app.route("/check", methods=["GET"])
def check():
    if current_user.is_authenticated:
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "User is logged in",
                    "user": {"username": current_user.username},
                }
            ),
            200,
        )
    return jsonify({"status": "error", "message": "User is not logged in"}), 401


@app.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"status": "success", "message": "User logged out"}), 200
