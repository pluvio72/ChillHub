// Defining stuff for the youtube API
const videoContainer = document.getElementById('playlist-container-youtube')
const searchResults = document.getElementById('youtube-search-results')
const searchButton = document.getElementById('for-youtube-search')
const DISCOVERY_DOCS = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

// Get the modal
var modal = document.getElementById("youtubeModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
searchButton.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Load auth2 library
function handleClientLoad() {
    gapi.load('client:auth2', initClient)
}

// Init API client library and set up sign in listeners
function initClient() {
    gapi.client
        .init({
            discoveryDocs: [DISCOVERY_DOCS],
            clientId: YOUTUBE_CLIENT_ID,
            scope: SCOPES
        })
        .then(() => {
            // Listen for sign in state changes
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            // Handle initial sign in state
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            return gapi.auth2
        });
}

// Update UI sign in state changes
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        searchButton.style.display = 'block';
        loadClient()
        youtubePlaylists()
    } else {
        searchButton.style.display = 'none';
    }
}

// For signing in
function authenticate() {
    return gapi.auth2
        .getAuthInstance()
        .signIn({
            scope: SCOPES
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
        .load(DISCOVERY_DOCS)
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
// Dis[;ay up to 6 of the users playlists]
function youtubePlaylists() {
    return gapi.client.youtube.playlists
        .list({
            part: "snippet,contentDetails",
            maxResults: 6,
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
              <iframe width="40%" height="20%" src="https://www.youtube.com/embed/videoseries?list=${playlistId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
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

// Triger search when user presses enter
document.getElementById('youtube-search').onkeydown = function(event) {
    if (event.keyCode == 13) {
        search();
    }
}

// Don't mind me just making stuff unobtrusive
document.getElementById('youtube-icon').addEventListener('click', function () {
        authenticate().then(loadClient).then(youtubePlaylists)
    }
);
document.getElementById('youtube-search-button').addEventListener('click', function () {
    search();
}
);

// Youtube channel search
function search() {
    // Geting value in input
    var inputVal = document.getElementById("youtube-search").value;
    return gapi.client.youtube.search.list({
            "part": "snippet",
            "maxResults": 10,
            "q": inputVal
        })
        .then(
            function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                const playlistItems = response.result.items;
                if (playlistItems) {
                    let output = "<br><h4>Your Youtube Results</h4>";

                    //loop through lists and show all of them
                    playlistItems.forEach((item) => {
                        const videoId = item.id;
                        if (videoId.kind == "youtube#channel"){
                            output += `<a href="https://www.youtube.com/channel/${item.id.channelId}"><img class ="test" width="18%" height="20%" src ="${item.snippet.thumbnails.default.url}"></a>`}
                        else if (videoId.kind == "youtube#video"){
                            output += `
                            <iframe width="18%" height="20%" src="https://www.youtube.com/embed/${videoId.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            `
                        }
                    });
                    // show videos
                    searchResults.innerHTML = output;
                } else {
                    searchResults.innerHTML = `No videos with that name`;
                }
            },
            function (err) {
                console.error("Execute error", err);
            }
        );
}
