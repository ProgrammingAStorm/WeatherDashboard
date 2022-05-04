const APIKEY = "a08c74698b6f4ec795426b447ed75b26";
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
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${APIKEY}`).then(function(response) {
        response.json().then(function(data) {
            var uvi = data.daily[0].uvi;

            $("#today")
            .empty()
            .append(
                $("<h3>")
                .text(name + " " + new Date(data.daily[0].dt * 1000).toISOString().substring(0, 10)),

                $("<h4>")
                .text("Temp: " + data.daily[0].temp.day + "° F"),

                $("<h4>")
                .text("Wind: " + data.daily[0].wind_speed + "MPH"),

                $("<h4>")
                .text("Humidity " + data.daily[0].humidity + "%"),

                $("<h4>")
                .text("UV Index: ")
                .append(
                    $("<span>")
                    .text(uvi)
                    .attr("id", "uvi")
                )
            );

            if (uvi < 3) {
                $("#uvi").addClass("green")
            } else if (uvi >= 3 && uvi < 6) {
                $("#uvi").addClass("yellow")
            } else if (uvi >= 6 && uvi < 8) {
                $("#uvi").addClass("orange")
            } else if (uvi >=8 && uvi < 10) {
                $("#uvi").addClass("red")
            } else if (uvi > 9) {
                $("#uvi").addClass("purple text-light")
            }

            $("#5-day").empty();

            for (var x = 0; x < 5; x++) {
                $("#5-day").append(
                    $("<div>")
                    .addClass("card d-flex").append(
                        $("<h3>")
                        .addClass("card-header bg-dark text-light")
                        .text(new Date(data.daily[x + 1].dt * 1000).toISOString().substring(0, 10)),

                        $("<div>")
                        .addClass("card-body bg-secondary").append(
                            $("<h4>")
                            .text("Temp: " + data.daily[x + 1].temp.day + "° F"),

                            $("<h4>")
                            .text("Wind: " + data.daily[x + 1].wind_speed + "MPH"),
            
                            $("<h4>")
                            .text("Humidity " + data.daily[x + 1].humidity + "%")
                        )
                    )
                )
            }
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