// Handles to temperature DOM elements
var curi = document.getElementById("currTempIn");
var curo = document.getElementById("currTempOut");
var mxti = document.getElementById("maxTempIn");
var mnti = document.getElementById("minTempIn");
var mxto = document.getElementById("maxTempOut");
var mnto = document.getElementById("minTempOut");
var upd = document.getElementById("updateTime");
var ctx = document.getElementById("temps");


// Handles to trend DOM elements
var tru = document.getElementById("trendUp");
var trd = document.getElementById("trendDown");


// Main temperature graph
var temps = new Chart(ctx, {
type: "line",
data: {
    labels: [], // x-axis labels
    datasets: [
        {
            // y-dataset for observed indoor temperatures
            label: "Indoors",
            data: [],
            lineTension: 0,
            backgroundColor: "transparent",
            borderColor: "#4cb5b5",
            borderWidth: 2,
            pointRadius: 0
        },
        {
            // y-dataset for day's maximum indoor temperature line,
            // shows a horizontal line at the max temperature
            label: "Indoors max",
            data: [],
            lineTension: 0,
            backgroundColor: "transparent",
            borderColor: "#439898",
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [2, 10]
        },
        {
            // y-dataset for day's minimum indoor temperature line,
            // shows a horizontal line at the min temperature
            label: "Indoors min",
            data: [],
            lineTension: 0,
            backgroundColor: "transparent",
            borderColor: "#59cccc",
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [2, 10]
        },
        {
            // y-dataset for observed outdoor temperatures
            label: "Outdoors",
            data: [],
            lineTension: 0,
            backgroundColor: "transparent",
            borderColor: "#e4629f",
            borderWidth: 2,
            pointRadius: 0
        },
        {
            // y-dataset for day's maximum outdoor temperature line,
            // shows a horizontal line at the max temperature
            label: "Outdoors max",
            data: [],
            lineTension: 0,
            backgroundColor: "transparent",
            borderColor: "#c16e95",
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [2, 10]
        },
        {
            // y-dataset for day's minimum outdoor temperature line,
            // shows a horizontal line at the min temperature
            label: "Outdoors min",
            data: [],
            lineTension: 0,
            backgroundColor: "transparent",
            borderColor: "#e07fac",
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [2, 10]
        },
    ]
},
options: {
    scales: {
        yAxes: [{
            ticks: {
            // Use some intuitive max and min
            // values for the temperature y-axis
            min: 14,
            max: 36,
            stepSize: 2
            }
        }],
        xAxes: [{
            ticks: {
            autoSkip: true,
            maxTicksLimit: 20,
            userCallback: function(label, index, labels) {
                // Strip down x-axis labels
                return label.substring(11,16)
            },
            }
        }],
    },
    legend: {
        display: false // legend not needed since there's just one relevant dataset
    },
    hover: {
        mode: null // disables on-hover datapoint highlight
    },
    tooltips: {
        yAlign: "top",
        mode: "x-axis", // always show tooltip on chart hover
        displayColors: false, // don't show line color square in tooltip
        callbacks: {
            title: function(tooltipItem){
                // Show full datetime string in tooltip
                return this._data.labels[tooltipItem[0].index].substring(0, 16);
            },
            label: function(tooltipItems, data) {
                let label = data.datasets[tooltipItems.datasetIndex].label;
                if (label == "Indoors" || label == "Outdoors") {
                    // Only show current temperatures in tooltip
                    return label + ": " + tooltipItems.yLabel.toFixed(2) + "°C";
                }
            }
        }
    }
}
});


// Function for getting new data and parsing it into the UI elements
function updateData() {
// Define path to backend data entrypoint.
var url = "temperature/read";


// Make GET request to backend
$.get(url, function(data) {
    var iy = [], ix = [];
    var oy = [], ox = [];

    // Place current, max and min temperatures into card views
    curi.innerHTML = parseFloat(data[data.length - 1].temp).toFixed(2);
    curo.innerHTML = parseFloat(data[data.length - 1].outdoors).toFixed(2);
    mxti.innerHTML = parseFloat(Math.max.apply(Math, data.map(function(el) { return el.temp; }))).toFixed(2);
    mnti.innerHTML = parseFloat(Math.min.apply(Math, data.map(function(el) { return el.temp; }))).toFixed(2);
    mxto.innerHTML = parseFloat(Math.max.apply(Math, data.map(function(el) { return el.outdoors; }))).toFixed(2);
    mnto.innerHTML = parseFloat(Math.min.apply(Math, data.map(function(el) { return el.outdoors; }))).toFixed(2);

    // Show the previous data fetch time in top bar
    upd.innerHTML = data[data.length - 1].timestamp;

    // Parse fetched data into arrays
    for (var i = 0; i < data.length; i++) {
        ix.push(data[i].timestamp);
        iy.push(parseFloat(data[i].temp).toFixed(2));
        oy.push(parseFloat(data[i].outdoors).toFixed(2));
    }

    // Place observed temperatures into the graph
    temps.data.labels = ix;
    temps.data.datasets[0].data = iy;
    temps.data.datasets[3].data = oy;

    // Create horizontal lines for max and min temperatures and draw them into the graph
    var maxSeriesIn = Array(data.length);
    var minSeriesIn = Array(data.length);
    var maxSeriesOut = Array(data.length);
    var minSeriesOut = Array(data.length);
    temps.data.datasets[1].data = maxSeriesIn.fill(mxti.innerHTML, 0, data.length);
    temps.data.datasets[2].data = minSeriesIn.fill(mnti.innerHTML, 0, data.length);
    temps.data.datasets[4].data = maxSeriesOut.fill(mxto.innerHTML, 0, data.length);
    temps.data.datasets[5].data = minSeriesOut.fill(mnto.innerHTML, 0, data.length);

    // Show temperature trend arrow based on temperature delta
    // TODO: implement this for outdoors temperature block
    if (data[data.length - 1].temp >= data[data.length - 2].temp) {
        tru.style.display = "inline";
        trd.style.display = "none";
    } else {
        trd.style.display = "inline";
        tru.style.display = "none";
    }

    // Redraw the graph
    temps.update();
});
}


// Fetch new data every 10 seconds from the backend
updateData();
setInterval(updateData, 10000);
