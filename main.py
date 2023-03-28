from flask import Flask, render_template
from flask_bootstrap import Bootstrap

from keys import YOUTUBE_CLIENT_ID, YOUTUBE_API_KEY
app = Flask(__name__)
Bootstrap(app)


@app.route('/')
def home():
    return render_template('index.html', YOUTUBE_CLIENT_ID=YOUTUBE_CLIENT_ID,
                           YOUTUBE_API_KEY=YOUTUBE_API_KEY)
