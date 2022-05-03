const APIKEY = "a08c74698b6f4ec795426b447ed75b26"
var searchHistory = [];

function addHistory(name, lon, lat) {
    if(searchHistory.length === 8) {
        searchHistory.shift();
        searchHistory.push({
            name: name,
            lon: lon,
            lat: lat
        });

        saveHistory();

        loadHistory();
    }
    else {
        $("#search-history").append(
            $("<button>")
            .addClass("btn btn-secondary")
            .text(name)
            .attr("data-pos", searchHistory.length)
        );

        searchHistory.push({
            name: name,
            lon: lon,
            lat: lat
        });
        saveHistory();
    }
}
function getWeather(name, lon, lat) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKEY}`).then(function(response) {
        response.json().then(function(data) {
            $("#today")
            .empty()
            .append(
                $("<h3>")
                .text(name + new Date(data.current.dt).toISOString().substring(0, 10)),

                $("<h4>")
                .text("Temp: " + data.current.temp + "° F"),

                $("<h4>")
                .text("Wind: " + data.current.wind_speed + "MPH"),

                $("<h4>")
                .text("Humidity " + data.current.humidity + "%")
            )
        })
    })

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&appid=${APIKEY}`).then(function(response) {
        response.json().then(function(data) {
            console.log(new Date(data.list[0].dt).toISOString())
        })
    })
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
        for(var x = 0; x < searchHistory.length; x++) {    
            $("#search-history").append(
                $("<button>")
                .addClass("btn btn-secondary")
                .text(searchHistory[x].name)
                .attr("data-pos", x)
            );
        }
    }
    else {
        $(".btn-secondary").each(function(index) {
            $(this).text(searchHistory[index].name)
        })
    }
}

loadHistory();

search_api.create("search", {
    on_result: function(o){
        addHistory(o.result.properties.Label, o.result.properties.Lon, o.result.properties.Lat);

        getWeather(o.result.properties.Label, o.result.properties.Lon, o.result.properties.Lat)
    }
})

$("#search-history").on("click", "button", function(event) {
    getWeather(
        searchHistory[$(this).attr("data-pos")].name,
        searchHistory[$(this).attr("data-pos")].lon,
        searchHistory[$(this).attr("data-pos")].lat
    )
})