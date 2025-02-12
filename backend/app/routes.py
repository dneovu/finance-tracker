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
    format_transactions,
    format_friends_and_requests,
    format_incoming_requests,
)
from app.user import User
from app.cloudinary import cloudinary_upload_avatar
from datetime import datetime


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

        # приводим добавленную категорию к нужному формату для отправки
        category = format_categories([res])

        con.commit()
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Category added",
                    "categories": category,
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


@app.route("/transactions", methods=["GET"])
def get_transactions():
    if request.method != "GET":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    try:
        con, cur = db_connect()

        res = cur.execute(
            """
            SELECT 
                t.id, 
                t.amount, 
                t.date, 
                c.id AS category_id, 
                c.name AS category_name, 
                c.type AS category_type
            FROM "transaction" t
            JOIN "category" c ON t."category_id" = c."id"
            WHERE c."user_id" = %s
            """,
            (current_user.id,),
        ).fetchall()
        transactions = format_transactions(res)

        if not res:
            return (
                jsonify(
                    {
                        "status": "success",
                        "message": "No transactions",
                        "transactions": {},
                    }
                ),
                200,
            )

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "User has transactions",
                    "transactions": transactions,
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


@app.route("/add-transaction", methods=["POST"])
def add_transaction():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    request_data = request.get_json()
    amount = int(request_data.get("amount"))
    date = request_data.get("date")
    category_id = request_data.get("category_id")

    if not amount or amount > 1000000 or not date or not category_id:
        return (
            jsonify({"status": "error", "message": "Missing required fields"}),
            400,
        )

    if amount < 0:
        amount *= -1

    try:
        con, cur = db_connect()
        # проверяем, принадлежит ли категория пользователю
        category_res = cur.execute(
            """
            SELECT name, type FROM "category"
            WHERE id = %s AND user_id = %s;
            """,
            (category_id, current_user.id),
        ).fetchone()

        if not category_res:
            return (
                jsonify(
                    {"status": "Error", "message": "Error while adding transaction"}
                ),
                400,
            )
        category_name, category_type = category_res

        res = cur.execute(
            """
            INSERT INTO "transaction" ("amount", "date", "category_id") 
            VALUES (%s, %s, %s) 
            RETURNING id, amount, date, category_id;
            """,
            (amount, date, category_id),
        ).fetchone()
        con.commit()

        if not res:
            return (
                jsonify(
                    {"status": "Error", "message": "Error while adding transaction"}
                ),
                400,
            )
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Transaction added",
                    "transactions": {
                        res[0]: {
                            "id": res[0],
                            "amount": float(res[1]),
                            "date": res[2].isoformat(),
                            "category": {
                                "id": res[3],
                                "name": category_name,
                                "type": category_type,
                            },
                        }
                    },
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


@app.route("/delete-transaction", methods=["POST"])
def delete_transaction():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    request_data = request.get_json()
    transaction_id = request_data.get("id")

    try:
        con, cur = db_connect()
        # проверка, что транзакция принадлежит пользователю
        transaction_category_id = cur.execute(
            'SELECT "category_id" FROM "transaction" WHERE "id" = %s',
            (transaction_id,),
        ).fetchone()[0]

        category_user_id = cur.execute(
            'SELECT "user_id" FROM "category" WHERE "id" = %s',
            (transaction_category_id,),
        ).fetchone()[0]

        if int(category_user_id) != int(current_user.id):
            return jsonify({"status": "error", "message": "Unauthorized"}), 401

        cur.execute(
            'DELETE FROM "transaction" WHERE "id" = %s',
            (transaction_id,),
        )
        con.commit()
        return jsonify({"status": "success", "message": "Transaction deleted"}), 200
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if con:
            con.close()


@app.route("/friends", methods=["GET"])
def get_friends():
    if request.method != "GET":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    try:
        con, cur = db_connect()

        con, cur = db_connect()

        # получаем друзей и исходящие заявки
        friends_and_outgoing_requests = cur.execute(
            """
            SELECT f.friend_id, f.status, u.username, u.logo,
                CASE WHEN f.status = 1 THEN 'friend' ELSE 'outgoing_request' END AS type
            FROM friends f
            JOIN "user" u ON f.friend_id = u.id
            WHERE f.user_id = %s;
            """,
            (current_user.id,),
        ).fetchall()

        # получаем входящие заявки
        incoming_requests = cur.execute(
            """
            SELECT f.user_id, f.status, u.username, u.logo
            FROM friends f
            JOIN "user" u ON f.user_id = u.id
            WHERE f.friend_id = %s AND f.status = 0;
            """,
            (current_user.id,),
        ).fetchall()

        # форматируем результат
        formatted_friends, formatted_outgoing_requests = format_friends_and_requests(
            friends_and_outgoing_requests
        )
        formatted_incoming_requests = format_incoming_requests(incoming_requests)

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "User has friends",
                    "friends": formatted_friends,
                    "outgoing_requests": formatted_outgoing_requests,
                    "incoming_requests": formatted_incoming_requests,
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


@app.route("/friends/send-request", methods=["POST"])
def add_friend():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    request_data = request.get_json()
    friend_name = request_data.get("username")

    try:
        con, cur = db_connect()

        friend_data = cur.execute(
            'SELECT "id", "username", "logo" FROM "user" WHERE "username" = %s',
            (friend_name,),
        ).fetchone()
        # если пользователя не существует
        if not friend_data:
            return error_response("INVALID_USERNAME", 404)

        friend_id, friend_username, friend_logo = friend_data  # Распаковываем данные
        # проверка на уже добавленного друга
        res = cur.execute(
            'SELECT "status" FROM "friends" WHERE "user_id" = %s AND "friend_id" = %s',
            (current_user.id, friend_id),
        ).fetchone()
        if res:
            if res[0] == 1:
                return (
                    jsonify({"status": "error", "message": "Friend already added"}),
                    400,
                )
            if res[0] == 0:
                return (
                    jsonify({"status": "error", "message": "Request already sent"}),
                    400,
                )
        # отпрвка заявки (статус 0)
        cur.execute(
            'INSERT INTO "friends" ("user_id", "friend_id", "status") VALUES (%s, %s, %s)',
            (current_user.id, friend_id, 0),
        )

        con.commit()
        # формируем json
        friend = {
            "id": friend_id,
            "username": friend_username,
            "logo": friend_logo,
            "status": 0,
        }

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Friend request sent",
                    "friend": friend,
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


@app.route("/friends/accept-request", methods=["POST"])
def accept_friend_request():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    request_data = request.get_json()
    friend_id = request_data.get("id")

    try:
        con, cur = db_connect()
        # обновляем статус заявки у друга
        cur.execute(
            'UPDATE "friends" SET "status" = 1 WHERE "user_id" = %s AND "friend_id" = %s',
            (friend_id, current_user.id),
        )
        # создаем обратную запись для пользователя
        cur.execute(
            'INSERT INTO "friends" ("user_id", "friend_id", "status") VALUES (%s, %s, %s)',
            (current_user.id, friend_id, 1),
        )

        # получаем данные нового друга
        friend_data = cur.execute(
            'SELECT "id", "username", "logo" FROM "user" WHERE "id" = %s',
            (friend_id,),
        ).fetchone()
        if not friend_data:
            return (
                jsonify({"status": "error", "message": "Friend not found"}),
                404,
            )
        # если друг найден, формируем json
        friend = {
            "id": friend_data[0],
            "username": friend_data[1],
            "logo": friend_data[2],
            "status": 1,
        }

        con.commit()
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Friend request accepted",
                    "friend": friend,
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


@app.route("/friends/delete-friend", methods=["POST"])
def delete_friend():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    request_data = request.get_json()
    friend_id = request_data.get("id")

    try:
        con, cur = db_connect()
        # удаляем обе связанные записи
        cur.execute(
            'DELETE FROM "friends" WHERE ("user_id" = %s AND "friend_id" = %s) OR ("user_id" = %s AND "friend_id" = %s)',
            (current_user.id, friend_id, friend_id, current_user.id),
        )
        con.commit()
        return jsonify({"status": "success", "message": "Friend deleted"}), 200
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if con:
            con.close()

@app.route("/friends/cancel-request", methods=["POST"])
def cancel_friend_request():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    request_data = request.get_json()
    friend_id = request_data.get("id")

    try:
        con, cur = db_connect()
        cur.execute(
            'DELETE FROM "friends" WHERE "user_id" = %s AND "friend_id" = %s',
            (current_user.id, friend_id),
        )
        con.commit()
        return jsonify({"status": "success", "message": "Friend request canceled"}), 200
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if con:
            con.close() 
            
@app.route("/friends/decline-request", methods=["POST"])
def decline_friend_request():
    if request.method != "POST":
        return error_response("METHOD_NOT_ALLOWED", 405)
    if not current_user.is_authenticated:
        return error_response("USER_NOT_LOGGED_IN", 401)

    request_data = request.get_json()
    friend_id = request_data.get("id")

    try:
        con, cur = db_connect()
        cur.execute(
            'DELETE FROM "friends" WHERE "user_id" = %s AND "friend_id" = %s',
            (friend_id, current_user.id),
        )
        con.commit()
        return jsonify({"status": "success", "message": "Friend request declined"}), 200
    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if con:
            con.close()