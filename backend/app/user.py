from app import login_manager
from flask_login import UserMixin
from app.utils import db_connect


class User(UserMixin):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password


@login_manager.user_loader
def load_user(user_id):
    con, cur = db_connect()
    res = cur.execute(
        'SELECT "username", "password" FROM "user" WHERE id = %s', (user_id,)
    ).fetchone()
    con.close()

    if res:
        username, password = res
        return User(user_id, username, password)

    return None
