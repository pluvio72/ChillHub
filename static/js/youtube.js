const authorizeButton = document.getElementById('authorize')
const executeButton = document.getElementById('execute')
const videoContainer = document.getElementById('playlist-container-youtube')

/**
 * Sample JavaScript code for youtube.playlists.list
 * See instructions for running APIs Explorer code samples locally:
 * https://developers.google.com/explorer-help/guides/code_samples#javascript
 */

// Display channel data
function showChannelData(data) {
    const channelData = document.getElementById("channel-data");
    channelData.innerHTML = data;
}

function authenticate() {
    return gapi.auth2
        .getAuthInstance()
        .signIn({
            scope: "https://www.googleapis.com/auth/youtube.readonly"
        })
        .then(
            function () {
                console.log("Sign-in successful");
            },
            function (err) {
                console.error("Error signing in", err);
            }
        );
}

function loadClient() {
    gapi.client.setApiKey(YOUTUBE_API_KEY);
    return gapi.client
        .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(
            function () {
                console.log("GAPI client loaded for API");
            },
            function (err) {
                console.error("Error loading GAPI client for API", err);
            }
        );
}

// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
    return gapi.client.youtube.playlists
        .list({
            part: "snippet,contentDetails",
            maxResults: 25,
            mine: true,
        })
        .then(
            function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                const playlistItems = response.result.items;
                if (playlistItems) {
                    let output = "<br><h4>Your Youtube Playlists</h4>";

                    //loop through lists and show all of them
                    playlistItems.forEach((item) => {
                        const playlistId = item.id;

                        output += `
              <iframe width="100%" height="auto" src="https://www.youtube.com/embed/videoseries?list=${playlistId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
              `;
                    });
                    // show videos
                    videoContainer.innerHTML = output;
                } else {
                    videoContainer.innerHTML = `No Playlists`;
                }
            },
            function (err) {
                console.error("Execute error", err);
            }
        );
}

gapi.load("client:auth2", function () {
    gapi.auth2.init({
        client_id:  YOUTUBE_CLIENT_ID,
    });
});
