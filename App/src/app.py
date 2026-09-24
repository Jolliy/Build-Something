from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

@app.route('/', methods=["GET","POST"])
def start():
    # if request.method == 'POST':
    #     name = request.form['username']
    #     return f"Hello {name}, POST request received"
    return render_template('startscreen.html')

@app.route('/add', methods=["POST"])
def add_listing():
    return

# potential(reciever)

@app.route('/evening_planner', methods=["GET","POST"])
def evening_planner():
    return

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)