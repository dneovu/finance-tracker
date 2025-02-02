from app import app
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify
from flask_login import login_user, current_user, logout_user
from app.utils import (
    db_connect,
    error_response,
    validate_auth_input,
    validate_password_input,
    validate_username_input,
)
from app.user import User


@app.errorhandler(400)
def bad_request(error):
    return error_response("BAD_REQUEST", 400)


@app.errorhandler(404)
def not_found(error):
    return error_response("NOT_FOUND", 404)


@app.errorhandler(500)
def internal_error(error):
    return error_response("INTERNAL_ERROR", 500)


@app.route("/register", methods=["POST"])
def register():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if current_user.is_authenticated:
        return error_response("USER_LOGGED_IN", 400)

    request_data = request.get_json()
    username = request_data.get("username")
    password = request_data.get("password")

    validation_error = validate_auth_input(username, password)
    if validation_error:
        return validation_error

    password_hash = generate_password_hash(password)

    try:
        con, cur = db_connect()
        cur.execute(
            'INSERT INTO "user" ("username", "password") VALUES (%s, %s)',
            (username, password_hash),
        )
        con.commit()
    except Exception as e:
        if "duplicate key" in str(e).lower():
            return error_response("USERNAME_TAKEN", 400)
        app.logger.error(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
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
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if current_user.is_authenticated:
        return error_response("USER_LOGGED_IN", 400)

    request_data = request.get_json()
    username = request_data.get("username")
    password = request_data.get("password")

    validation_error = validate_auth_input(username, password)
    if validation_error:
        return validation_error

    try:
        con, cur = db_connect()
        res = cur.execute(
            'SELECT "id", "username", "password" FROM "user" WHERE "username" = %s',
            (username,),
        ).fetchone()

        if res is None or not check_password_hash(res[2], password):
            return error_response("INVALID_DATA", 400)

        # создание сессии
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
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if con:
            con.close()


@app.route("/check", methods=["GET"])
def check():
    if request.method == "GET":
        if not current_user.is_authenticated:
            return error_response("USER_NOT_LOGGED_IN", 401)

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


@app.route("/logout", methods=["POST"])
def logout():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)
    logout_user()
    return jsonify({"status": "success", "message": "User logged out"}), 200


@app.route("/change-username", methods=["POST"])
def update_profile():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    request_data = request.get_json()
    username = request_data.get("username")

    validation_error = validate_username_input(username)
    if validation_error:
        return validation_error

    try:
        con, cur = db_connect()
        if current_user.username == username:
            return error_response("USERNAME_SAME", 400)

        res = cur.execute(
            'UPDATE "user" SET "username" = %s WHERE "id" = %s',
            (username, current_user.id),
        )

        # кол-во обновленных строк
        if res.rowcount == 1:
            con.commit()
            logout_user()  # удаляем сессию
            return (
                jsonify(
                    {
                        "status": "success",
                        "message": "Username updated. Please log in again.",
                    }
                ),
                200,
            )

    except Exception as e:
        if "duplicate key" in str(e).lower():
            return error_response("USERNAME_TAKEN", 400)
        app.logger.error(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if con:
            con.close()


@app.route("/change-password", methods=["POST"])
def change_password():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    request_data = request.get_json()
    current_password = request_data.get("password")
    new_password = request_data.get("newPassword")

    validation_error = validate_password_input(
        current_password
    ) or validate_password_input(new_password)
    if validation_error:
        return validation_error

    if not check_password_hash(current_user.password, current_password):
        return error_response("INVALID_PASSWORD", 400)

    if current_password == new_password:
        return error_response("PASSWORD_SAME", 400)

    try:
        con, cur = db_connect()
        new_hash_password = generate_password_hash(new_password)
        cur.execute(
            'UPDATE "user" SET "password" = %s WHERE "id" = %s',
            (new_hash_password, current_user.id),
        )
        con.commit()
        logout_user()  # удаляем сессию

        return jsonify({"status": "success", "message": "Password changed"}), 200

    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if con:
            con.close()
