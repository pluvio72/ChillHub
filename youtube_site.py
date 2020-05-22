# -*- coding: utf-8 -*-

# Sample Python code for youtube.playlists.list
# See instructions for running these code samples locally:
# https://developers.google.com/explorer-help/guides/code_samples#python

import os

import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors

scopes = ["https://www.googleapis.com/auth/youtube.readonly"]


def logInYoutube():

    playlists = []  # used later to show playlists
    playlist_titles = []  # ^^

    # Disable OAuthlib's HTTPS verification when running locally.
    # *DO NOT* leave this option enabled in production.
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"
    client_secrets_file = "client_secret_pc.json"

    # Get credentials and create an API client
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        client_secrets_file, scopes)
    credentials = flow.run_console()
    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, credentials=credentials)

    request = youtube.playlists().list(
        part="snippet,contentDetails",
        maxResults=25,
        mine=True
    )
    response = request.execute()  # This is the dictionary response from google

    for playlist_num in range(0, len(response['items'])):
        embed_link = "https://www.youtube.com/embed/videoseries?list="
        playlists.append(embed_link+str(response['items'][playlist_num]['id']))
        playlist_titles.append(
            str(response['items'][playlist_num]['snippet']['title']))
    print(playlists)
    print(playlist_titles)
    # ['items'][0-x]['id'] is what I'm looking for
    # print(response['items'][0]['id'],
    #      file=open("id.json", "a"))
