from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


tasks = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'POST':
        task = request.json.get('task')
        tasks.append(task)
        return jsonify(tasks)
    elif request.method == 'GET':
        return jsonify(tasks)

@app.route('/tasks/<int:index>', methods=['DELETE'])
def delete_task(index):
    if 0 <= index < len(tasks):
        tasks.pop(index)
        return jsonify(tasks)
    return jsonify({'error': 'Invalid index'}), 400

if __name__ == '__main__':
    app.run(debug=True)
