import os
from flask import Flask, render_template
from flask_bootstrap import Bootstrap

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

from keys import spotify_client_id, spotify_client_secret
os.environ['SPOTIPY_CLIENT_ID'] = spotify_client_id
os.environ['SPOTIPY_CLIENT_SECRET'] = spotify_client_secret

spotify_api = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())

app = Flask(__name__)
Bootstrap(app)

@app.route('/')
def home():
    return render_template('index.html')