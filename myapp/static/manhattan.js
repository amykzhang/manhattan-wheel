function drawManhattan(data) {

    // 1. Access data

    const bpAccessor = d => parseInt(d.cBP);
    const pAccessor = d => parseFloat(d.P);
    const chrAccessor = d => parseInt(d.CHR);

    // significant RSIDs in Nature article Helgeland et al. 2022
    const sig_rsid = [
        "rs10493377",
        "rs10889551",
        "rs2767486",
        "rs10493544",
        "rs545608",
        "rs2816985",
        "rs77165542",
        "rs11676272",
        "rs11708067",
        "rs1482853",
        "rs2610989",
        "rs1032296",
        "rs6899303",
        "rs263377",
        "rs2268657",
        "rs2268647",
        "rs1820721",
        "rs209421",
        "rs7772579",
        "rs1772945",
        "rs78412508",
        "rs17145750",
        "rs10487505",
        "rs287621",
        "rs12672489",
        "rs117212676",
        "rs28457693",
        "rs28642213",
        "rs11187129",
        "rs1830890",
        "rs1985927",
        "rs2298615",
        "rs2728641",
        "rs7132908",
        "rs6538845",
        "rs7310615",
        "rs3741508",
        "rs75806555",
        "rs2585058",
        "rs17817288",
        "rs111810144",
        "rs739669",
        "rs78263856",
        "rs148252705",
        "rs13038017",
        "rs5926278"
    ]
    
    // 2. Set up dimensions and margins

    const width = window.innerHeight;
    let dimensions = {
        width: width,
        height: width,
        radius: width / 2,
        innerRadius: width / 6,
        margin: {top: 20, right: 20, bottom: 20, left: 20},
    }
    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom
    dimensions.boundedRadius = dimensions.radius
        - ((dimensions.margin.left + dimensions.margin.right) / 2)

    // 3. Draw canvas
    const svg = d3.select("#manhattan_viz")
        .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
            .attr("transform", `rotate(0)`)

    const bounds = svg
        .append("g")
            .style("transform", `translate(${
                dimensions.margin.left + dimensions.boundedRadius
                }px, ${
                    dimensions.margin.top + dimensions.boundedRadius
                }px)`)
        .style("font-size", 12)
        .style("font-family", "sans-serif");

    // Click to rotate area
    const bgRect = svg
        .append("g")
            .style("transform", `translate(${dimensions.width/2 - dimensions.innerRadius}px, 
                ${dimensions.height/2 - dimensions.innerRadius}px)`)
            .style("cursor", "pointer")
    
    bgRect.append("text")
        .attr("id", "instruction")
        .attr("x", dimensions.innerRadius + 10)
        .attr("y", dimensions.innerRadius)
        .attr("text-anchor", "start")
        .attr("font-size", "12px")
        .attr("font-weight", 400)
        .attr("font-style", "italic")
        .attr("fill", "#9F2D55")
        .style("opacity", 0)
        .text("Click to rotate")
    
    bgRect.append("rect")
            .attr("width", dimensions.innerRadius*2)
            .attr("height", dimensions.innerRadius*2)
            .attr("transform", `rotate(0)`)
            .style("fill", "#9F2D55")
            .style("opacity", 0.05)
            .style("rx", dimensions.innerRadius)
        .on("click", clicked);


    // 4.Set up scales

    const angleScale = d3.scaleLinear()
        .domain(d3.extent(data, bpAccessor))
        .range([0, Math.PI * 2 ]); // this is in radians

    const radiusScale = d3.scaleLog()
        .domain([1e-32, 0.05])
        .range([dimensions.boundedRadius, dimensions.innerRadius])
        .nice();
    
    palette = ["#ef8737","#341648", "#9f2d55"];

    const colorScale = d3.scaleOrdinal()
        .domain(d3.extent(data, chrAccessor))
        .range(palette)

    // const sizeScale = d3.scaleLog()
    //     .domain(d3.extent(data, pAccessor))
    //     .range([2,2]);

    // const opacityScale = d3.scaleLog()
    //     .domain(d3.extent(data, pAccessor))
    //     .range([1,1]);
    
    const getCoordinatesForAngle = (angle, offset=1) => [
        Math.cos(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
        Math.sin(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
    ]

    // 5. Draw peripherals
    
    // bulls eye overlay
    bounds.append("circle")
        .attr("r", radiusScale(1e-30))
        .attr("class", "grid-circle")
    
    bounds.append("circle")
    .attr("r", radiusScale(1e-20))
    .attr("class", "grid-circle")

    bounds.append("circle")
        .attr("r", radiusScale(1e-10))
        .attr("class", "grid-circle")
    
    bounds.append("circle")
    .attr("r", radiusScale(1e-2))
    .attr("class", "grid-center")
        .style("fill", "#F6F5F1")
        .style("opacity", 1)

    const peripherals = bounds.append("g")

    const radiusTicks = radiusScale.ticks(4)
    
    const gridCircles = radiusTicks.map(d => (
        peripherals.append("circle")
        .attr("r", radiusScale(d))
        .attr("class", "grid-line")
    ))
    

    // Draw chart

    const circles = bounds
        .append("g")
        .attr("id", "circlesM");

    circles.selectAll("circle")
        .data(data)
        .join("circle")
            .attr("cx", d => d3.pointRadial(angleScale(bpAccessor(d)), radiusScale(pAccessor(d)))[0])
            .attr("cy", d => d3.pointRadial(angleScale(bpAccessor(d)), radiusScale(pAccessor(d)))[1])
            .attr("r", 2)
            .attr("opacity", 1)
            .attr("fill", d => colorScale(chrAccessor(d)))
            .style("cursor", "pointer")
        .on("mouseover", onMouseOver)
        .on("mousemove", onMouseMove)
        .on("mouseout", onMouseOut)
        .on("click", onMouseClick);
    
    circles.selectAll("circle")
        .filter(d => sig_rsid.includes(d.RSID))
        .attr("r", 7)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .raise();

    // -- Tooltip

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        
    function onMouseOver(e, d) {
        tooltip
            .transition().duration("20")
            .style("opacity", 1)
            .text("SNP " + d.RSID + " on chromosome " + d.CHR)
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

    function onMouseClick(e,d,i) {
        // Color clicked SNP and grey out the rest
        const clickedDot = d3.select(this).raise();
        const isHighlighted = clickedDot
            .classed("highlighted");
        
        if (!isHighlighted) {
            circles.selectAll("circle")
                .classed("highlighted", false)
                .classed("greyed-out", false)
                .transition().attr("r", d => sig_rsid.includes(d.RSID) ? 7 : 2.5);
        
            clickedDot
                .classed("highlighted", true)
                .transition().attr("r", 7);

            circles.selectAll("circle:not(.highlighted)")
                .classed("greyed-out", true)
                .transition().attr("r", d => sig_rsid.includes(d.RSID) ? 7 : 2.5);

        } else {
            // Reset all circles to their original state
            circles.selectAll("circle")
               .classed("highlighted", false)
               .classed("greyed-out", false)
               .transition().attr("r", d => sig_rsid.includes(d.RSID) ? 7 : 2.5);
          }
        
        Promise.all([
            fetch(`/temporal_data/${d.RSID}/`)
                .then(response => response.json()),
            fetch(`/gene_data/${d.RSID}/`)
                .then(response => response.json())
                .catch(error => {
                    console.error('Error fetching data from Entrez:', error);
                    return { gene: 'Unknown' };
                })
        ])
        .then(([data1, data2]) => {
            updateTemporal(data1.data, data1.selectedID, data2.gene || null);
        })
    }
    

    // CLICK TO ROTATE
    let initialRotation = 0

    function clicked(event) {
        d3.select(this).raise();

        // Get the current rotation angle of the SVG
        const currentRotate = circles.attr("transform");
        const regex = /rotate\(([-+]?\d+(?:\.\d+)?)\)/; // Regex to extract the rotation angle
        const match = regex.exec(currentRotate);
        initialRotation = match ? parseFloat(match[1]) : 0; // Extract the angle or default to 0

        circles
            .transition()
            .ease(d3.easeBackOut.overshoot(2.5))
            .duration(750)
            .attr("transform", `rotate(${60 + initialRotation})`)   
    }

}

// Fetch data from Django backend
const selectedAge = 0.66 // Displaying GWAS data at 6 months
fetch(`/manhattan_data/${selectedAge}/`)
    .then(response => response.json())
    .then(data => {
        drawManhattan(data.data);
        drawTemporal();
    })
    .catch(error => console.error('Error fetching data:', error));




// Scrolly functions
// Show/hide plot
function showManhattan() {
    d3.select("#manhattan_viz")
        .transition().ease(d3.easeCubicIn).duration(250)
        .style("opacity", "1")
}

function hideManhattan() {
    d3.select("#manhattan_viz")
        .transition().ease(d3.easeCubicOut).duration(250)
        .style("opacity", "0")
}

// Select/unselect specific RSID
function selectRSID(rsid) {
    const svg = d3.select("#manhattan_viz svg")
    svg.select("#circlesM").selectAll("circle")
        .classed("greyed-out", d => d.RSID === rsid ? false : true)

}

function unselectRSID() {
    const svg = d3.select("#manhattan_viz svg")
    svg.select("#circlesM").selectAll("circle")
        .classed("greyed-out", false)

}

// Hide/show click to rotate
function hideInstruction() {
    const svg = d3.select("#manhattan_viz svg")
    svg.select("#instruction")
        .transition().ease(d3.easeCubicOut).duration(250)
        .style("opacity", 0)
}

function showInstruction() {
    const svg = d3.select("#manhattan_viz svg")
    svg.select("#instruction")
        .transition().ease(d3.easeCubicOut).duration(250)
        .style("opacity", 0.8)
}