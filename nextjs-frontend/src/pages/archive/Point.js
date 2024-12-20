class Point {
  constructor(point, id, options, p5) {
    this.p = point;
    this.id = id;
    this.active = false;
    this.hidden = false;
    this.hover = false;
    this.showScaleProcess = 0;
    this.showScaleStep = 0.03;
    this.defaultScale = 2;
    this.activeScale = 6;
    this.p5 = p5;
    this.name = options?.name;
    this.primary = options?.primary;
  }

  update() {
    if (this.active && this.showScaleProcess < 1) {
      this.showScaleProcess += this.showScaleStep;
    } else if (this.showScaleProcess > 1) {
      this.showScaleProcess = 1;
    }
  }

  draw() {
    this.p5.push();
    this.p5.translate(this.p.x, this.p.y, this.p.z);
    if (this.active && !this.hidden) {
      this.p5.fill(0, 0, 0);
      this.p5.sphere(this.p5.map(this.showScaleProcess, 1, 0, 0, 2));
      this.p5.fill(255, 0, 255);
      this.p5.sphere(this.p5.map(this.showScaleProcess, 0, 1, 0, 2));
      if (this.primary)
        this.drawLabel(this.p, { type: "active", text: this.name, fill: { r: 236, g: 239, b: 241 }, stroke: { r: 0, g: 0, b: 0 } });
    } else {
      if (this.hover) {
        this.p5.fill(0, 0, 255);
        this.p5.sphere(5);
        this.drawLabel(this.p, { type: "hover", text: this.name, fill: { r: 236, g: 239, b: 241 }, stroke: { r: 0, g: 0, b: 0 } });
      } else {
        this.p5.fill(0, 0, 0);
        this.p5.sphere(2);
      }
    }
    this.p5.pop();
  }

  drawLabel(point, { type, text, fill, stroke }) {
    let camF = this.p5._renderer._curCamera;
    let camPos = this.p5.createVector(camF.eyeX, camF.eyeY, camF.eyeZ); // p5.Vector
    let camMag = camPos.mag();
    let angleRadians = Math.acos(camPos.z / camMag);
    let angleDegrees = this.p5.degrees(angleRadians);

    // console.log('Angle between camera and x/y origin plane:', angleDegrees);

    this.p5.rectMode(this.p5.CORNER);
    this.p5.push();
    this.p5.rotateZ(angleRadians);

    if (type === "hover") {
      this.p5.stroke(0, 0, 255);
      this.p5.noFill();
      this.p5.rect(15, 20, text?.length * 8, -40);
      this.p5.textAlign(this.p5.LEFT, this.p5.CENTER);
      this.p5.textSize(12);
      this.p5.fill(0, 0, 255);
      this.p5.text(text, 20, 0);
    } else if (type === "active") {
      this.p5.stroke(255, 0, 255);
      this.p5.noFill();
      this.p5.rect(15, 20, text?.length * 8, -40);
      this.p5.textAlign(this.p5.LEFT, this.p5.CENTER);
      this.p5.textSize(12);
      this.p5.fill(255, 0, 255);
      this.p5.text(text, 20, 0);
    }
    this.p5.pop();
  }

  resetScaleIn() {}

  getVector() {
    return this.p;
  }
  setActive(a) {
    this.active = a;
  }
  getActive() {
    return this.active;
  }
  setPrimary(p) {
    this.primary = p;
  }
  getPrimary() {
    return this.primary;
  }
  setHidden(h) {
    if (this.hidden && !h) {
      this.resetScaleIn();
    }
    this.hidden = h;
  }
  getHidden() {
    return this.hidden;
  }
  setHover(h) {
    this.hover = h;
  }
  getHover() {
    return this.hover;
  }
  getId() {
    return this.id;
  }
}

export default Point;
