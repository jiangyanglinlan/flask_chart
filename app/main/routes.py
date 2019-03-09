from flask import (
    render_template,
    request,
    redirect,
    url_for,
    abort,
    jsonify,
)
from app.utils import (
    current_time,
    debug,
    log
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
    return render_template('chart.html', name=name, all_charts=all_charts)


@main.route('/chart/api/v1.0/items', methods=['POST'])
def add_chart():
    if not request.form:
        abort(400)
    type = request.form.get('type')
    option = request.form.get('option')
    name = '创建于' + current_time() + '的' + type
    d = Data(name=name, option=option)
    db.session.add(d)
    db.session.commit()
    return jsonify({'result': 'success', 'option_name': d.name, 'option_id': d.id})


@main.route('/chart/api/v1.0/items/<id>', methods=['GET'])
def get_chart(id):
    d = Data.query.filter_by(id=id).first()
    return jsonify({'result': 'success', 'option_name': d.name, 'option': d.option, \
                    'option_id': d.id}) if d else jsonify({'result': 'not found'})


