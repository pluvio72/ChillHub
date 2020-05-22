from flask import Flask, render_template
from flask_bootstrap import Bootstrap
import youtube_site

app = Flask(__name__)
Bootstrap(app)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/youtube')
def youtube():
    youtube_site.logInYoutube()
    return render_template('index.html')
