from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)

@app.route("/")
def hello_world():
    return "<p>Hello, Flask!</p>"
