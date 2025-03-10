class Simulation {
  constructor() {
    this.svg = d3.select("#chart");
    this.width = this.svg.attr("width");
    this.height = this.svg.attr("height");

    this.initDefaults();
    this.drawCoordinateSystem();
    this.drawGrid();
  }

  initDefaults() {
    this.originX = this.width / 2;
    this.originY = this.height / 2;
    this.positionX = 0;
    this.positionY = 0;
    this.angleRad = 0;
    this.initialVelocity = 0;
    this.acceleration = 0;
    this.trajectoryColor = "#000";
    this.currentTime = 0;
    this.timeStep = 0;
  }

  selectElement(id) {
    return document.getElementById(id);
  }

  drawCoordinateSystem() {
    const { svg, width, height } = this;

    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", height / 2)
      .attr("x2", width)
      .attr("y2", height / 2)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    svg
      .append("line")
      .attr("x1", width / 2)
      .attr("y1", 0)
      .attr("x2", width / 2)
      .attr("y2", height)
      .attr("stroke", "black")
      .attr("stroke-width", 2);
  }

  drawGrid() {
    const { svg, width, height } = this;

    const gridStep = 20;
    const gridColor = "green";

    for (let i = 0; i < width; i += gridStep) {
      svg
        .append("line")
        .attr("x1", i)
        .attr("y1", 0)
        .attr("x2", i)
        .attr("y2", height)
        .attr("stroke", gridColor)
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "2,2");
    }

    for (let i = 0; i < height; i += gridStep) {
      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", i)
        .attr("x2", width)
        .attr("y2", i)
        .attr("stroke", gridColor)
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "2,2");
    }
  }

  loadInputData() {
    this.originX = this.width / 2 + parseFloat(this.selectElement("x0").value);
    this.originY = this.height / 2 + parseFloat(this.selectElement("y0").value);

    this.angleRad =
      (parseFloat(this.selectElement("angle").value) * Math.PI) / 180;

    this.initialVelocity = Math.max(
      0,
      parseFloat(this.selectElement("velocity").value)
    );

    this.acceleration = parseFloat(this.selectElement("acceleration").value);
    this.trajectoryColor = this.selectElement("color").value;
    this.timeStep = 1;
    this.currentTime = 0;

    this.positionX = this.originX;
    this.positionY = this.originY;
  }

  generateTrajectory() {
    this.loadInputData();

    if (this.initialVelocity < 0) {
      alert("Швидкість не може бути меншою за 0!");
      return;
    }

    let iterationLimit = 10000;
    const pathGroup = this.svg.append("g").attr("class", "trajectory");

    pathGroup
      .append("circle")
      .attr("cx", this.positionX)
      .attr("cy", this.height - this.positionY)
      .attr("r", 2)
      .attr("fill", this.trajectoryColor);

    while (
      this.positionX >= 0 &&
      this.positionX < this.width &&
      this.positionY >= 0 &&
      this.positionY < this.height &&
      iterationLimit > 0
    ) {
      this.positionX =
        this.originX +
        this.initialVelocity * Math.cos(this.angleRad) * this.currentTime +
        (this.acceleration / 2) *
          Math.cos(this.angleRad) *
          this.currentTime ** 2;

      this.positionY =
        this.originY +
        this.initialVelocity * Math.sin(this.angleRad) * this.currentTime +
        (this.acceleration / 2) *
          Math.sin(this.angleRad) *
          this.currentTime ** 2;

      if (this.initialVelocity <= 0) {
        alert("Швидкість стала меншою 0!");
        break;
      }

      pathGroup
        .append("circle")
        .attr("cx", this.positionX)
        .attr("cy", this.height - this.positionY)
        .attr("r", 2)
        .attr("fill", this.trajectoryColor);

      this.currentTime += this.timeStep;
      iterationLimit--;
    }
  }

  clearGraph() {
    this.svg.selectAll(".trajectory").remove();
  }
}

const simulation = new Simulation();

document
  .getElementById("draw")
  .addEventListener("click", () => simulation.generateTrajectory());
document
  .getElementById("clear")
  .addEventListener("click", () => simulation.clearGraph());
