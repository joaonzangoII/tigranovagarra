// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
    $('.search-button').attr('disabled', false);

    searchMultipleVideos();
}

function makeRequest(q) {
    var request = gapi.client.youtube.videos.list({
        id: q,
        part: "snippet,contentDetails,statistics"
    });

    request.execute(function(response) {
        var customEvent = new CustomEvent('responseReceived', { 'detail': response });
        console.log("responseReceived", customEvent);
        document.dispatchEvent(customEvent);
    });
}

// Search for a specified string.
function search(target) {
    var index = $(target).attr('data-index');
    var q = $(`#query-${index}`).val();
    makeRequest(q);
    // var request = gapi.client.youtube.search.list({
    //     q: q,
    //     part: "snippet,contentDetails,statistics"
    // });

    // request.execute(function(response) {
    //     var str = JSON.stringify(response.result);
    //     console.log(str);
    //     var items = response.result.items;
    //     var statistics = items[0].statistics;
    //     var src = items[0].snippet.thumbnails.maxres.url;
    //     $(`#img-container-${index}`).html('<pre>' +  JSON.stringify(statistics) + '</pre>');
    //     $(`#search-container-${index} img`).attr('src', src);
    //     //$(`#search-container-${index} div`).html('<pre>' +  JSON.stringify(statistics) + '</pre>');
    //     $(`#search-container-${index} div i.like`).html(statistics.likeCount);
    //     $(`#search-container-${index} div i.view`).html(statistics.viewCount);
    //     $(`#search-container-${index} div i.comment`).html(statistics.commentCount);

    // });
}


function searchMultipleVideos() {
    makeRequest(videos.join(','));
}

function sort(items) {
    return items.sort(function(a, b) {return a.statistics.likeCount - b.statistics.likeCount;});
}

document.addEventListener('responseReceived', function (e) { 
    const items = e.detail.items;
    $('#containers').html('');

    sort(items).reverse();

    const elements = items.map(item => {
        var title = item.snippet.title;
        var src = item.snippet.thumbnails.maxres.url;
        var statistics = item.statistics;

        return `<div id="search-container-${item.etag}" class="card flex col-md-3 mt-4 nm-1 p-0">
        <img class="card-img-top" src="${src}" width="200"/>
            <div class="card-body">
                <h6>${title.replace('Prémios Tigra Nova Garra: ', '')}</h6>
                <i class="fa fa-thumbs-up like"> ${statistics.likeCount}</i>
                <i class="fa fa-eye view"> ${statistics.viewCount}</i>
                <i class="fa fa-comments comment"> ${statistics.commentCount}</i>
            </div>
        </div>`;
    });

    $('#containers').html(elements);
}, false);