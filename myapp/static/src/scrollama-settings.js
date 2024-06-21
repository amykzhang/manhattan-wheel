// using d3 for convenience
var $main = d3.select("main");
var $scrolly = $main.select("#scrolly");
var $figure = $scrolly.select("figure");
var $article = $scrolly.select("article");
var $step = $article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
    // 1. update height of step elements
    var stepHeight = Math.floor(window.innerHeight * 0.75);
    $step.style("height", stepHeight + "px");
    $step.style("width", "250px")

    var figureHeight = window.innerHeight / 2;
    var figureMarginTop = (window.innerHeight - figureHeight) / 2;
    
    $figure
        .style("height", figureHeight + "px")
        .style("top", figureMarginTop + "px");

    // 3. tell scrollama to update new element dimensions
    scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
    
    console.log(response);
    // response = { element, direction, index }
    let currentIndex = response.index;
    let currentDirection = response.direction;
    
    // add color to current step only
    $step.classed("is-active", function(d, i) {
        return i === currentIndex;
    });
    
    // update graphic based on step
    switch(currentIndex){

        case 0:
            showManhattan();
            unselectRSID();
            hideErrorBars();
            fetch(`/temporal_data/rs2767486/`)
                .then(response => response.json())
                .then(data => defaultTemporal(data.data, "rs2767486", "LEPR"))
                .catch(error => console.error('Error fetching data:', error));
            if(currentDirection === 'up'){
                hideManhattan();
                hideTemporal();
            }
            break;

        case 1:
            selectRSID("rs2767486");
            if(currentDirection === 'up'){
                unselectRSID();
                hideTemporal();
            }
            break;
        case 2:
            showTemporal();
            if(currentDirection === 'up'){
                hideErrorBars();
            }
            break;
        case 3:
            showErrorBars();
            if(currentDirection === 'up'){
            }
            break;
        case 4:
            if(currentDirection === 'up'){
                fetch(`/temporal_data/rs2767486/`)
                    .then(response => response.json())
                    .then(data => defaultTemporal(data.data, "rs2767486", "LEPR"))
                    .catch(error => console.error('Error fetching data:', error));
            }
            break;
        case 5:
            if(currentDirection === 'up'){
                hideInstruction();
            }
            break;
        case 6:
            showInstruction();
            if(currentDirection === 'up'){
                hideInstruction();
            }
            break;
        default:
            break;
    }

}

function setupStickyfill() {
    d3.selectAll(".sticky").each(function() {
        Stickyfill.add(this);
    });
}

function init() {
    setupStickyfill();

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();

    // 2. setup the scroller passing options
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller
        .setup({
            scrolly: "#scrolly",
            figure: "figure",
            article: "article",
            step: "#scrolly article .step",
            offset: 0.5,
            debug: false
        })
        .onStepEnter(handleStepEnter);

    // setup resize event
    window.addEventListener("resize", handleResize);
    
}

// initialize
init();
