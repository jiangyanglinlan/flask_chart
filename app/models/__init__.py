from app import db


class Data(db.Model):
    __tablename__ = 'data'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    option = db.Column(db.Text)