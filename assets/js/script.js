var searchHistory = [];

function addHistory(name) {
    if(searchHistory.length === 8) {
        searchHistory.shift();
        searchHistory.push(name);

        saveHistory();

        loadHistory();
    }
    else {
        var history = document.createElement("button");
        history.className = "btn btn-secondary";
        history.textContent = name;

        $("#search-history").append(history);

        searchHistory.push(name);
        saveHistory();
    }
}
function saveHistory() {
    localStorage.setItem("history", JSON.stringify(searchHistory));
}
function loadHistory() {
    searchHistory = JSON.parse(localStorage.getItem("history"))

    if(!searchHistory) {
        searchHistory = [];
    }
    if(searchHistory.length === 0) {
        return;
    }

    if($(".btn-secondary").length === 0) {
        searchHistory.forEach(element => {
            var history = document.createElement("button");
            history.className = "btn btn-secondary";
            history.textContent = element;
    
            $("#search-history").append(history);
        });
    }
    else {
        $(".btn-secondary").each(function(index) {
            $(this).text(searchHistory[index])
        })
    }
}

loadHistory();

search_api.create("search", {
    on_result: function(o){
        addHistory(o.result.properties.Label);

        console.log(o.result.properties.Lat)
        console.log(o.result.properties.Lon)
    }
})