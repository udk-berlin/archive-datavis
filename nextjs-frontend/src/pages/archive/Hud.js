class Hud {
  constructor(p5) {
    this.p5 = p5;
    this.labels = [];
  }

  drawLabel(point, { side, text, fill, stroke  }) {
    this.p5.push();
    this.p5.translate(point?.x, point?.y, point?.z);
    this.p5.rectMode(this.p5.CORNER);
    this.p5.ellipseMode(this.p5.CENTER);

    typeof fill === "object" ? this.p5.fill(fill.r, fill.g, fill.b) : this.p5.noFill();
    typeof stroke === "object" ? this.p5.stroke(stroke.r, stroke.g, stroke.b) : this.p5.stroke(0);
    this.p5.strokeWeight(3);
    this.p5.ellipse(0, 0, 50, 50);

    if (side === "left") {
<<<<<<< Updated upstream
      this.p5.line(-25, 0, -150, 0);
      // this.p5.fill(236, 239, 241)
      this.p5.rect(-150, -25, -1 * text?.length * 22, 50);
      typeof stroke === "object" ? this.p5.fill(stroke.r, stroke.g, stroke.b) : this.p5.fill(0); 
      this.p5.textAlign(this.p5.RIGHT, this.p5.CENTER);
      this.p5.textSize(32);
      this.p5.text(text, -175, -7);
=======
      this.p5.line(screenPos.x + -10, screenPos.y, screenPos.x + -50, screenPos.y);
      this.p5.fill(236, 239, 241)
      this.p5.rect(screenPos.x + -50, screenPos.y + -15, -1 * text?.length * 11, 30);
      typeof stroke === "object" ? this.p5.fill(stroke.r, stroke.g, stroke.b) : this.p5.fill(0);
      this.p5.textAlign(this.p5.RIGHT, this.p5.CENTER);
      this.p5.textSize(16);
      this.p5.text(text, screenPos.x + -60, screenPos.y + -3);
>>>>>>> Stashed changes
    }

    this.p5.pop();
  }

  addLabel({ point, text, type }) {
    this.labels.push({ point, text, type });
  }

  clearLabels() {
    this.labels = [];
  }

  draw(point, side) {
    this.p5.push();

    this.p5.translate(point?.x, point?.y, point?.z);

    const cam = this.p5._renderer._curCamera;
    let camPosition = this.p5.createVector(cam.eyeX, cam.eyeY, cam.eyeZ);

    let dir = this.p5.createVector(camPosition.x - point?.x, camPosition.y - point?.y, camPosition.z - point?.z);

    let theta = Math.atan2(dir.x, dir.z);
    let phi = Math.atan2(dir.y, Math.sqrt(dir.x * dir.x + dir.z * dir.z));

    this.p5.rotateY(theta);
    this.p5.rotateX(-phi);

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

      this.drawLabel(label.point, { side: "left", text: label.text, stroke: stroke });
    });

    this.p5.pop();
  }
}
export default Hud;
