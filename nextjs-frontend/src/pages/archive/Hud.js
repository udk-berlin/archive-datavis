class Hud {
  constructor(p5) {
    this.p5 = p5;
    this.labels = [];
    this.screenPos = { x: 0, y: 0 };
  }

  drawLabel(point, { side, text, fill, stroke, screenPos = { x: 0, y: 0 } }) {
  
    this.p5.rectMode(this.p5.CORNER);
    this.p5.ellipseMode(this.p5.CENTER);

    typeof fill === "object" ? this.p5.fill(fill.r, fill.g, fill.b) : this.p5.noFill();
    typeof stroke === "object" ? this.p5.stroke(stroke.r, stroke.g, stroke.b) : this.p5.stroke(0);
    this.p5.strokeWeight(1);
    this.p5.ellipse(screenPos.x, screenPos.y, 20, 20);

    if (side === "left") {

      this.p5.line(screenPos.x + -10, screenPos.y, screenPos.x + -50, screenPos.y);
      // this.p5.fill(236, 239, 241)
      this.p5.rect(screenPos.x + -50, screenPos.y + -15, -1 * text?.length * 10, 30);
      typeof stroke === "object" ? this.p5.fill(stroke.r, stroke.g, stroke.b) : this.p5.fill(0);
      this.p5.textAlign(this.p5.RIGHT, this.p5.CENTER);
      this.p5.textSize(14);
      this.p5.text(text, screenPos.x + -60, screenPos.y + -3);

    }
  }

  updatePosition(i, p) {
    let scp = this.p5.screenPosition(p.x, p.y, p.z);
    this.labels[i].screenPos = { x: scp.x, y: scp.y };
  }

  updateLabelPositions() {
    this.labels.forEach((label, i) => {
      this.updatePosition(i, label.point);
    });
  }

  addLabel({ point, text, type }) {
    this.labels.push({ point, text, type, screen: { x: 0, y: 0 } });
  }

  clearLabels() {
    this.labels = [];
  }

  draw(point, side) {
    this.labels.forEach((label) => {
      let stroke = { r: 0, g: 0, b: 0 };
      switch (label.type) {
        case "hover":
          stroke = { r: 0, g: 0, b: 255 };
          break;
        case "active":
          stroke = { r: 255, g: 0, b: 255 };
          break;
        default:
          stroke = { r: 0, g: 0, b: 0 };
      }
      this.drawLabel(label.point, { side: "left", text: label.text, stroke: stroke, screenPos : label.screenPos });
    });
  }
}
export default Hud;
