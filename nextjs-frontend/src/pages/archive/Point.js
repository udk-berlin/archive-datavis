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
    this.labelMode = null;

    this.screenPos = { x: 0, y: 0 };
  }

  update() {
    if (this.active && this.showScaleProcess < 1) {
      this.showScaleProcess += this.showScaleStep;
    } else if (this.showScaleProcess > 1) {
      this.showScaleProcess = 1;
    }

    let scp = this.p5.screenPosition(this.p.x, this.p.y, this.p.z);
    this.screenPos.x = scp.x;
    this.screenPos.y = scp.y;
  }

  draw() {
    this.labelMode = null;
    this.p5.push();
    this.p5.translate(this.p.x, this.p.y, this.p.z);
    if (this.active && !this.hidden) {
      this.p5.fill(0, 0, 0);
      this.p5.sphere(this.p5.map(this.showScaleProcess, 1, 0, 0, 2));
      this.p5.fill(255, 0, 255);
      this.p5.sphere(this.p5.map(this.showScaleProcess, 0, 1, 0, 2));
      if (this.primary) {
        this.labelMode = "active";
      }
      //  this.drawLabel(this.p, { type: "active", text: this.name, fill: { r: 236, g: 239, b: 241 }, stroke: { r: 0, g: 0, b: 0 } });
    } else {
      if (this.hover) {
        this.p5.fill(0, 0, 255);
        this.p5.sphere(5);
        this.labelMode = "hover";
        //  this.drawLabel(this.p, { type: "hover", text: this.name, fill: { r: 236, g: 239, b: 241 }, stroke: { r: 0, g: 0, b: 0 } });
      } else {
        this.p5.fill(0, 0, 0);
        this.p5.sphere(2);
      }
    }

    this.p5.pop();
  }

  draw2d() {
    switch (this.labelMode) {
      case "hover":
        this.drawLabel(this.p, { type: "hover", text: this.name, fill: { r: 236, g: 239, b: 241 }, stroke: { r: 0, g: 0, b: 0 } });
        break;
      case "active":
        this.drawLabel(this.p, { type: "active", text: this.name, fill: { r: 236, g: 239, b: 241 }, stroke: { r: 0, g: 0, b: 0 } });
        break;
      default:
    }
  }

  drawLabel(point, { type, text, fill, stroke }) {
    // console.log('Angle between camera and x/y origin plane:', angleDegrees);

    if (type === "hover") {
      this.p5.stroke(0, 0, 255);

      this.p5.fill(236, 239, 241);
      this.p5.rect(this.screenPos.x + 15, this.screenPos.y + 20, text?.length * 8, -40);

      this.p5.textAlign(this.p5.LEFT, this.p5.CENTER);
      this.p5.textSize(16);
      this.p5.fill(0, 0, 255);
      this.p5.text(text, this.screenPos.x + 20, this.screenPos.y + 0);
    } else if (type === "active") {
      this.p5.stroke(255, 0, 255);

      this.p5.fill(236, 239, 241);
      this.p5.rect(this.screenPos.x + 15, this.screenPos.y + 20, text?.length * 8, -40);


      this.p5.textAlign(this.p5.LEFT, this.p5.CENTER);
      this.p5.textSize(16);
      this.p5.fill(255, 0, 255);
      this.p5.text(text, this.screenPos.x + 20, this.screenPos.y + 0);
    }
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
