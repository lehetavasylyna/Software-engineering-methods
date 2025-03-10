class Simulation {
  constructor() {
    this.canvas = document.getElementById("chart");
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.initDefaults();
    this.drawCoordinateSystem();
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
    const { ctx, width, height } = this;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    this.drawGrid();
  }

  drawGrid() {
    const { ctx, width, height } = this;
    ctx.strokeStyle = "green";
    ctx.lineWidth = 0.5;

    const step = 50;

    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  loadInputData() {
    this.originX = this.width / 2 + parseFloat(this.selectElement("x0").value);
    this.originY = this.height / 2 + parseFloat(this.selectElement("y0").value);
    this.angleRad =
      (parseFloat(this.selectElement("angle").value) * Math.PI) / 180;

    let velocity = parseFloat(this.selectElement("velocity").value);
    if (velocity < 0) {
      alert("Швидкість не може бути від'ємною. Впишіть інше значення");
    }
    this.initialVelocity = velocity;

    this.acceleration = parseFloat(this.selectElement("acceleration").value);
    this.trajectoryColor = this.selectElement("color").value;
    this.timeStep = 1;
    this.currentTime = 0;

    this.positionX = this.originX;
    this.positionY = this.originY;
  }

  generateTrajectory() {
    this.loadInputData();
    let iterationLimit = 10000;
    this.ctx.fillStyle = this.trajectoryColor;

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

      this.ctx.beginPath();
      this.ctx.arc(
        this.positionX,
        this.height - this.positionY,
        2,
        0,
        Math.PI * 2
      );
      this.ctx.fill();

      this.currentTime += this.timeStep;
      iterationLimit--;
    }
  }

  clearGraph() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawCoordinateSystem();
  }
}

const simulation = new Simulation();

document
  .getElementById("draw")
  .addEventListener("click", () => simulation.generateTrajectory());
document
  .getElementById("clear")
  .addEventListener("click", () => simulation.clearGraph());
