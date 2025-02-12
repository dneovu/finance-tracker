from app import app
import psycopg
from flask import jsonify
from app.errors import ERROR_RESPONSES


def db_connect():
    con = psycopg.connect(
        host=app.config["DB_SERVER"],
        user=app.config["DB_USER"],
        password=app.config["DB_PASSWORD"],
        dbname=app.config["DB_NAME"],
    )
    cur = con.cursor()
    return con, cur


def error_response(key, status_code):
    response = ERROR_RESPONSES.get(
        key, {"message": "Unknown error", "status": "error", "code": "UNKNOWN"}
    )
    return jsonify(response), status_code


def validate_username_input(username, min_length=5, max_length=21):
    if not username or not min_length < len(username) < max_length:
        return error_response("INVALID_USERNAME", 400)
    return None


def validate_password_input(password, min_length=5, max_length=21):
    if not password or not min_length < len(password) < max_length:
        return error_response("INVALID_PASSWORD", 400)
    return None


def validate_auth_input(username, password):
    if (validate_username_input(username) is not None) or (
        validate_password_input(password) is not None
    ):
        return error_response("INVALID_DATA", 400)

    return None


# форматирует категории, полученные из бд, для отправки через json
def format_categories(categories):
    return {
        category[0]: {  # category[0] — id
            "id": category[0],
            "name": category[1],  # category[1] — name
            "type": category[3],  # category[3] — type
        }
        for category in categories
    }


def format_transactions(transactions):
    return {
        transaction[0]: {
            "id": transaction[0],
            "amount": float(transaction[1]),
            "date": transaction[2].isoformat(),
            "category": {
                "id": transaction[3],
                "name": transaction[4],
                "type": transaction[5],
            },
        }
        for transaction in transactions
    }


def format_friends_and_requests(data):
    friends = []
    outgoing_requests = []

    for item in data:
        friend_data = {
            "id": item[0],
            "status": item[1],
            "username": item[2],
            "logo": item[3],
        }
        if item[4] == "friend":
            friends.append(friend_data)
        else:
            outgoing_requests.append(friend_data)

    return friends, outgoing_requests


def format_incoming_requests(data):
    return [
        {"id": req[0], "status": req[1], "username": req[2], "logo": req[3]}
        for req in data
    ]
