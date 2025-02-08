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
    format_categories,
    format_category,
)
from app.user import User
from app.cloudinary import cloudinary_upload_avatar


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
    DEFAULT_USER_LOGO = "https://res.cloudinary.com/deuyjjozh/image/upload/v1738588834/avatars/ndlc02bbbezws3gxruzr.jpg"

    try:
        con, cur = db_connect()
        # создаем пользователя
        cur.execute(
            'INSERT INTO "user" ("username", "password", "logo") VALUES (%s, %s, %s) RETURNING "id"',
            (username, password_hash, DEFAULT_USER_LOGO),
        )
        user_id = cur.fetchone()[0]
        con.commit()
        # добавляем дефолтные категории
        categories = [
            ("Рестораны", user_id, False),
            ("Одежда", user_id, False),
            ("Магазин", user_id, False),
        ]
        cur.executemany(
            'INSERT INTO "category" ("name", "user_id", "type") VALUES (%s, %s, %s)',
            categories,
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
            'SELECT "id", "username", "password", "logo" FROM "user" WHERE "username" = %s',
            (username,),
        ).fetchone()

        if res is None or not check_password_hash(res[2], password):
            return error_response("INVALID_DATA", 400)

        # создание сессии
        user = User(res[0], res[1], res[2], res[3])
        login_user(user)

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "User logged in",
                    "user": {"username": res[1], "logo": res[3]},
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
                    "user": {
                        "username": current_user.username,
                        "logo": current_user.logo,
                    },
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


@app.route("/upload-avatar", methods=["POST"])
def upload_avatar():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    file = request.files.get("file")
    if file is None:
        return error_response("NO_FILE_PROVIDED", 400)

    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

    if not file.filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS:
        return error_response("INVALID_IMAGE_FORMAT", 422)

    try:
        # передаем объект file напрямую в cloudinary
        upload_result = cloudinary_upload_avatar(file)
        secure_url = upload_result.get("secure_url")
        if not secure_url:
            app.logger.error("Cloudinary error: secure_url not returned")
            return error_response("CLOUDINARY_UPLOAD_ERROR", 500)

        # полученную от cloudinary ссылку на картинку сохраняем в базе
        con, cur = db_connect()
        cur.execute(
            'UPDATE "user" SET "logo" = %s WHERE "id" = %s',
            (secure_url, current_user.id),
        )
        con.commit()

        return (
            jsonify(
                {"status": "success", "message": "Avatar uploaded", "url": secure_url}
            ),
            200,
        )

    except Exception as e:
        app.logger.error(f"Unexpected error during avatar upload: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if con:
            con.close()


# для получения текущих категорий пользователя
@app.route("/categories", methods=["GET"])
def get_categories():
    if request.method != "GET":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    try:
        con, cur = db_connect()
        res = cur.execute(
            'SELECT * FROM "category" WHERE "user_id" = %s', (current_user.id,)
        ).fetchall()

        if not res:
            return (
                jsonify(
                    {
                        "status": "success",
                        "message": "No categories",
                        "categories": {},
                    }
                ),
                200,
            )

        categories = format_categories(res)
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "User has categories",
                    "categories": categories,
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


@app.route("/add-category", methods=["POST"])
def add_category():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    request_data = request.get_json()
    name = request_data.get("name")
    type = request_data.get("type")

    try:
        con, cur = db_connect()
        res = cur.execute(
            'INSERT INTO category ("name", "user_id", "type") VALUES (%s, %s, %s) RETURNING "id", "name", "user_id", "type"',
            (name, current_user.id, type),
        ).fetchone()

        # приводим добавленную категорию к нужному формату для отправки на фронтенд
        category = format_category(res)
        print(category)
        con.commit()
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Category added",
                    "category": category,
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


@app.route("/delete-category", methods=["POST"])
def delete_category():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    request_data = request.get_json()
    category_id = request_data.get("id")

    try:
        con, cur = db_connect()
        cur.execute(
            'DELETE FROM "category" WHERE "id" = %s AND "user_id" = %s',
            (category_id, current_user.id),
        )
        con.commit()
        return jsonify({"status": "success", "message": "Category deleted"}), 200
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if con:
            con.close()
