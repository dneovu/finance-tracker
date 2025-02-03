from app import login_manager
from flask_login import UserMixin
from app.utils import db_connect


class User(UserMixin):
    def __init__(self, id, username, password, logo):
        self.id = id
        self.username = username
        self.password = password
        self.logo = logo


@login_manager.user_loader
def load_user(user_id):
    con, cur = db_connect()
    res = cur.execute(
        'SELECT "username", "password", "logo" FROM "user" WHERE id = %s', (user_id,)
    ).fetchone()
    con.close()

    if res:
        username, password, logo = res
        return User(user_id, username, password, logo)

    return None
