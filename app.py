from flask import Flask, render_template, request, redirect, flash

app = Flask(__name__)
app.secret_key = 'biem'


@app.route('/', methods=['GET', 'POST'])
def login():
    return render_template('login.html')
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']

        if username == 'admin' and password == 'password':
            return redirect('/dashboard')
        else:
            flash('Invalid credentials, try again.')

    return render_template('login.html')


if __name__ == '__main__':
    app.run(debug=True)
