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
    this.name = options?.name
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
    } else {
      if (this.hover) {
        this.p5.fill(0, 0, 255);
        this.p5.sphere(5);
      } else {
        this.p5.fill(0, 0, 0);
        this.p5.sphere(2);
      }
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
