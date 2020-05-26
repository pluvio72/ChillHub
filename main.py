import os
import base64
import urllib.parse
from flask import Flask, render_template, redirect, request
from flask_bootstrap import Bootstrap
import requests

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

from keys import spotify_client_id, spotify_client_secret, spotify_redirect_uri
os.environ['SPOTIPY_CLIENT_ID'] = spotify_client_id
os.environ['SPOTIPY_CLIENT_SECRET'] = spotify_client_secret
os.environ['SPOTIPY_REDIRECT_URI'] = spotify_redirect_uri

spotify_api = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())

spotify_scope = 'user-read-private user-read-email'

app = Flask(__name__)
Bootstrap(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/spotify-callback')
def spotify_callback():
    code = request.args.get('code')
    state = request.args.get('state')
    print(str(base64.encodestring(spotify_client_secret.encode())) + ':hello')
    # need to string.encode() before encoding to b64 because b64 uses 8bit to encode
    # and strings in python are unicode which it doesn't know how to convert
    # string.encode() turns it into utf-8 default so it can convert
    res = requests.post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': spotify_redirect_uri
    }, headers={
        'Authorization': 'Basic ' +
        f'{base64.encodestring(spotify_client_id.encode())}' +
        f':{base64.encodestring(spotify_client_secret.encode())}'
    })
    print(res.text)

@app.route('/spotify-login')
def spotify_login():
    return redirect('https://accounts.spotify.com/authorize' +
                    '?response_type=code' + '&client_id=' + 
                    spotify_client_id + '&scope=' + 
                    urllib.parse.quote(spotify_scope) + 
                    '&redirect_uri=' + 
                    urllib.parse.quote(spotify_redirect_uri))
