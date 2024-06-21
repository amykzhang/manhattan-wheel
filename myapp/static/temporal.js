// Set up accessors
const ageAccessor = d => parseFloat(d.AGE);
const betaAccessor = d => parseFloat(d.BETA) * -1;
const errorAccessor = d => parseFloat(d.SE);

// Set up dimensions
const width_T = window.innerHeight * 0.8;
let dimensions_T = {
    width: width_T,
    height: width_T * 0.8,
    margin: {top: 60, right: 60, bottom: 60, left: 60},
}

dimensions_T.boundedWidth = dimensions_T.width
    - dimensions_T.margin.left
    - dimensions_T.margin.right
dimensions_T.boundedHeight = dimensions_T.height
    - dimensions_T.margin.top
    - dimensions_T.margin.bottom

// Set up scales
const xScale_T = d3.scaleLinear()
    .domain([0, 8])
    .range([-20, dimensions_T.boundedWidth - 3])
    .nice();

const yScale_T = d3.scaleLinear()
    .domain([-0.4, 0.4])
    .range([dimensions_T.boundedHeight, 0])
    .nice();

//Draw temporal plot
function drawTemporal() {
    
    // Draw canvas
    const svg = d3.select("#temporal_viz")
        .append("svg")
            .attr("width", dimensions_T.width)
            .attr("height", dimensions_T.height)

    const bounds = svg.append("g")
        .style("transform", `translate(${
                dimensions_T.margin.left
            }px, ${
                dimensions_T.margin.top
            }px)`)
        .style("font-size", 12)
        .style("font-family", "sans-serif");


    // Draw peripherals
    const peripherals = bounds.append("g")

    // X Axis
    const xAxis = peripherals.append("g")
        .attr("class", "axis")
            .style("transform", `translateY(${dimensions_T.boundedHeight}px)`)
            .call(d3.axisBottom(xScale_T)
                .ticks(10))

    const xAxisLabel = peripherals.append("text")
        .attr("class", "tick-label-radius")
            .attr("x", dimensions_T.boundedWidth)
            .attr("y", dimensions_T.boundedHeight + 30)
            .attr("text-anchor", "end")
            .text("Child's Age");

    // Y Axis
    // const yAxis = peripherals.append("g")
    //     .attr("class", "axis")
    //         .call(d3.axisLeft(yScale_T)
    //             // .ticks(12)
    //             .tickFormat(d => d))
    //         // .call(g => g.select(".domain")
    //         //     .attr("display", "none")) //remove axis line
        
    const yAxisLabel = peripherals.append("text")
        .attr("class", "tick-label-radius")
            .attr("x", -25)
            .attr("y", -20)
            //.style("transform", "rotate(-90deg)")
            .style("text-anchor", "start")
            .text("Effect size on BMI, standardized to sex and gestational age (95% confidence intervals)");

    // Peripheral annotations
    const effectLine50 = peripherals
        .append("line")
            .attr("class", "temporal-line")
                .attr("x1", -25)
                .attr("y1", yScale_T(0))
                .attr("x2", dimensions_T.boundedWidth)
                .attr("y2", yScale_T(0))
                .style("opacity", 1)
    
    peripherals.append("text")
        .attr("class", "temporal-annot")
            .attr("x", dimensions_T.boundedWidth)
            .attr("y", yScale_T(0) + 15)
            .style("opacity", 1)
            .text("Seen in 50% of children")
    
    const effectLine55 = peripherals
        .append("line")
            .attr("class", "temporal-line")
                .attr("x1", -25)
                .attr("y1", yScale_T(0.125))
                .attr("x2", dimensions_T.boundedWidth)
                .attr("y2", yScale_T(0.125))
    
    peripherals.append("text")
        .attr("class", "temporal-annot")
            .attr("x", dimensions_T.boundedWidth)
            .attr("y", yScale_T(0.125) + 15)
            .text("55% of children")

    const effectLine60 = peripherals
        .append("line")
            .attr("class", "temporal-line")
                .attr("x1", -25)
                .attr("y1", yScale_T(0.25))
                .attr("x2", dimensions_T.boundedWidth)
                .attr("y2", yScale_T(0.25))
    
    peripherals.append("text")
        .attr("class", "temporal-annot")
            .attr("x", dimensions_T.boundedWidth)
            .attr("y", yScale_T(0.25) + 15)
            .text("60% of children")  
    
    const effectLine65 = peripherals
        .append("line")
            .attr("class", "temporal-line")
                .attr("x1", -25)
                .attr("y1", yScale_T(0.375))
                .attr("x2", dimensions_T.boundedWidth)
                .attr("y2", yScale_T(0.375))
    
    peripherals.append("text")
        .attr("class", "temporal-annot")
            .attr("x", dimensions_T.boundedWidth)
            .attr("y", yScale_T(0.375) + 15)
            .text("65% of children")      
    
    const effectLine45 = peripherals
        .append("line")
            .attr("class", "temporal-line")
                .attr("x1", -25)
                .attr("y1", yScale_T(-0.125))
                .attr("x2", dimensions_T.boundedWidth)
                .attr("y2", yScale_T(-0.125))
    
    peripherals.append("text")
        .attr("class", "temporal-annot")
            .attr("x", dimensions_T.boundedWidth)
            .attr("y", yScale_T(-0.125) + 15)
            .text("45% of children")

    const effectLine40 = peripherals
        .append("line")
            .attr("class", "temporal-line")
                .attr("x1", -25)
                .attr("y1", yScale_T(-0.25))
                .attr("x2", dimensions_T.boundedWidth)
                .attr("y2", yScale_T(-0.25))
    
    peripherals.append("text")
        .attr("class", "temporal-annot")
            .attr("x", dimensions_T.boundedWidth)
            .attr("y", yScale_T(-0.25) + 15)
            .text("40% of children")

    const temporalTitle = peripherals.append("text")
        .attr("id", "temporalTitle")
            .attr("x", -25)
            .attr("y", -40)
            .attr("text-anchor", "start")
            .attr("font-size", "18px")
            .attr("font-weight", 800)
            .attr("fill", "#9F2D55")
            .text("Click a genetic variant on the wheel to see its effect on BMI.")
    
    // Set up groups for error bars 
    const errorBars = bounds
        .append("g")
        .attr("id", "errorBars");
    
    // Set up groups for data circles
    const circlesT = bounds
        .append("g")
        .attr("id", "circlesT");
    
}

// Update temporal plot dots, error bars, and gene name based on selected SNP
function updateTemporal(data, selectedID, gene) {

    const svg = d3.select("#temporal_viz svg")

    // Check if graph is already populated
    const isSelected = svg.select("#circlesT").selectAll("circle")
        .data()
        .some(d => d.RSID === selectedID);
    
    // Reset graph
    svg.select("#errorBars").selectAll("line").remove();
    svg.select("#circlesT").selectAll("circle").remove();
    svg.select("#temporalTitle").text("Click a genetic variant on the wheel to see its effect on BMI.")

    if (isSelected) {
        // Reset graph
        svg.select("#errorBars").selectAll("line").remove();
        svg.select("#circlesT").selectAll("circle").remove();
        svg.select("#temporalTitle").text("Click a genetic variant on the wheel to see its effect on BMI.")
    } else {
        
        if (gene && gene !== "Unknown") {
            svg.select("#temporalTitle").text("This genetic variant, " + selectedID + ", belongs to the " + gene + " gene.");
        } else {
            svg.select("#temporalTitle").text("This genetic variant, " + selectedID + ", belongs to an unknown gene.");
        }

        // Draw error bars
        svg.select("#errorBars")
            .selectAll("line")
            .data(data)
            .join("line")
                .attr("x1", d => xScale_T(ageAccessor(d)))
                .attr("y1", d => yScale_T(betaAccessor(d) - 2*errorAccessor(d)))
                .attr("x2", d => xScale_T(ageAccessor(d)))
                .attr("y2", d => yScale_T(betaAccessor(d) + 2*errorAccessor(d)))
                .style("stroke", "#9F2D55")
                .style("stroke-width", 8)
                .style("stroke-linecap", "round")
                .style("opacity", 0.2);


        // Draw data points
        svg.select("#circlesT")
            .selectAll("circle")
            .data(data)
            .join("circle")
                .attr("cx", d => xScale_T(ageAccessor(d)))
                .attr("cy", d => yScale_T(betaAccessor(d)))
                .attr("r", 4)
                .attr("opacity", 1)
                .attr("fill", "#9F2D55")
                .style("cursor", "pointer")
            .on("mouseover", onMouseOver)
            .on("mousemove", onMouseMove)
            .on("mouseout", onMouseOut);
            // .on("click", onMouseClick)
    }

    // Tooltip

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")

    function onMouseOver(e, d) {
        tooltip
            .transition().duration("20")
            .style("opacity", 1)
            .text("Effect size at " + d.AGE + " years old: " + d3.format(".2f")(d.BETA * -1))
            .style("left", (e.pageX - 50) + "px")
            .style("top", (e.pageY - 50) + "px")
    }

    function onMouseMove(e, d) {
        tooltip
            .style("left", (e.pageX - 50) + "px")
            .style("top", (e.pageY - 50) + "px")
    }

    function onMouseOut(e, d) {
        tooltip
            .transition().duration("100")
            .style("opacity", 0)
    }

    // // Change age for manhattan plot
    // function onMouseClick(e,d,i) {
    //     // fetch(`/manhattan_data/${d.AGE}/`)
    //     //     .then(response => response.json())
    //     //     .then(data => drawManhattan(data.data, data.selectedAge));
    // }
}

// Scrolly functions
// Show/hide plot
function showTemporal() {
    d3.select("#temporal_viz")
        .transition().ease(d3.easeCubicIn).duration(250)
        .style("opacity", "1")
}

function hideTemporal() {
    d3.select("#temporal_viz")
        .transition().ease(d3.easeCubicOut).duration(250)
        .style("opacity", "0")
}

// Show/hide error bars
function hideErrorBars() {
    const svg = d3.select("#temporal_viz svg")
    svg.select("#errorBars")
        .transition().ease(d3.easeCubicOut).duration(250)
        .style("opacity", 0)
}

function showErrorBars() {
    const svg = d3.select("#temporal_viz svg")
    svg.select("#errorBars")
        .transition().ease(d3.easeCubicOut).duration(250)
        .style("opacity", 1)
}

// Set to selected RSID in temporal plot
function defaultTemporal(data, selectedID, gene) {

    const svg = d3.select("#temporal_viz svg")

    svg.select("#errorBars").selectAll("line").remove();
    svg.select("#circlesT").selectAll("circle").remove();
    svg.select("#temporalTitle").text("This genetic variant, " + selectedID + ", belongs to the " + gene + " gene.")        
    
    // Error bars
    svg.select("#errorBars")
        .selectAll("line")
        .data(data)
        .join("line")
            .attr("x1", d => xScale_T(ageAccessor(d)))
            .attr("y1", d => yScale_T(betaAccessor(d) - 2* errorAccessor(d)))
            .attr("x2", d => xScale_T(ageAccessor(d)))
            .attr("y2", d => yScale_T(betaAccessor(d) + 2* errorAccessor(d)))
            .style("stroke", "#9F2D55")
            .style("stroke-width", 8)
            .style("stroke-linecap", "round")
            .style("opacity", 0.2);


    // Data points
    svg.select("#circlesT")
        .selectAll("circle")
        .data(data)
        .join("circle")
            .attr("cx", d => xScale_T(ageAccessor(d)))
            .attr("cy", d => yScale_T(betaAccessor(d)))
            .attr("r", 4)
            .attr("opacity", 1)
            .attr("fill", "#9F2D55")
        // .on("click", onMouseClick)

}
