from flask import (
    render_template,
    request,
    redirect,
    url_for,
    abort,
    jsonify,
)
from . import main
from app import db
from app.models import Data


@main.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        name = request.form.get('name', '')
        if name != '':
            return redirect(url_for('.chart', name=name))
    return render_template('index.html')


@main.route('/chart/<name>')
def chart(name):
    all_charts = Data.query.all()
    print(all_charts)
    return render_template('chart.html', name=name)


@main.route('/chart/api/v1.0/items', methods=['POST'])
def add_chart():
    if not request.form:
        abort(400)
    name = request.form.get('name')
    option = request.form.get('option')
    d = Data(name=name, option=option)
    db.session.add(d)
    db.session.commit()
    return jsonify({'result': 'success', 'option_name': d.name, 'option_id': d.id})


@main.route('/chart/api/v1.0/items/<id>', methods=['GET'])
def get_chart():
    if not request.args or 'id' not in request.args:
        return jsonify({'result': 'error'})
    id = request.args.get('id')
    d = Data.get(id)
    return jsonify(d) if d else jsonify({'result': 'not found'})


