class Connections {
  constructor(p5) {
    this.connections = [];
    this.ellipses = [];
    this.p5 = p5;
  }


  


  draw() {
    this.connections.forEach((connection) => {
        connection.draw();
    });
  }


  getConnections() {
    return this.connections;
  }

  setConnections(connections) {
    this.connections = connections;
  }

  addConnection(p1,p2,options) {
    console.log('asdasdas',p1,p2,options)
    this.connections.push(new Connection({ p5: this.p5, p1, p2, ...options }));
  }
  
  clearConnections() {
    this.connections = [];
  }

  drawConnections() {
    this.connections.forEach((connection) => {
      this.p5.stroke(0, 250, 0);
      this.p5.beginShape();
      connection.forEach((point) => {
        this.p5.vertex(point.x, point.y, point.z);
      });
      this.p5.endShape(this.p5.CLOSE);
    });
  }
}

class Connection {
  constructor({ p5, p1, p2, animated = true, progress = 0, speed = 0.1 }) {
    this.p5 = p5;
    this.p1 = p1;
    this.p2 = p2;
    this.animated = animated;
    this.progress = progress;
    this.speed = speed;
  }


  draw() {
    this.update();
    if (this.animated) {
      this.drawCurveBetweenPoints(this.p1, this.p2, this.progress);
    } else {
      this.drawCurveBetweenPoints(this.p1, this.p2, 1);
    }
  }

  drawCurveBetweenPoints(p1, p2, progress) {
    progress = this.p5.constrain(progress, 0, 1);

    let midpoint = this.p5.constructor.Vector.add(p1, p2).mult(0.5);

    let direction = this.p5.constructor.Vector.sub(p2, p1).normalize();

    let up = this.p5.createVector(0, -1, 0);

    let projection = this.p5.constructor.Vector.mult(direction, direction.dot(up));
    let offset = this.p5.constructor.Vector.sub(up, projection).normalize();

    let amount = 100;

    let controlPoint = midpoint.copy().add(offset.mult(amount));

    let interp1 = p1.copy().lerp(controlPoint, progress);
    let interp2 = controlPoint.copy().lerp(p2, progress);

    let currentMidpoint = interp1.copy().lerp(interp2, progress);

    this.p5.push();
    this.p5.noFill();
    this.p5.stroke(255, 0, 255);
    this.p5.strokeWeight(1.5);
    this.p5.beginShape();
    this.p5.vertex(p1.x, p1.y, p1.z);
    this.p5.quadraticVertex(interp1.x, interp1.y, interp1.z, currentMidpoint.x, currentMidpoint.y, currentMidpoint.z);
    this.p5.endShape();
    this.p5.pop();
  }

  update() {
    this.progress += this.speed;
    if (this.progress > 1) {
      this.progress = 1;
    }
  }
}


/// old

// drawEllipseBetweenPoints(p1, p2) {
//     let midpoint = this.p5.constructor.Vector.add(p1, p2).mult(0.5);
//     let direction = this.p5.constructor.Vector.sub(p2, p1);
//     let dist = direction.mag();

//     let dir = direction.copy().normalize();

//     let originalVector = this.p5.createVector(1, 0, 0);

//     let angle = Math.acos(dir.dot(originalVector));
//     let axis = this.p5.constructor.Vector.cross(originalVector, dir);

//     if (axis.mag() < 0.0001 || isNaN(angle)) {
//       axis = this.p5.constructor.createVector(0, 0, 1);
//       angle = 0;
//     } else {
//       axis.normalize();
//     }

//     this.p5.push();
//     this.p5.translate(midpoint.x, midpoint.y, midpoint.z);
//     this.p5.rotate(angle, axis);
//     this.p5.noFill();
//     this.p5.stroke(255, 0, 255);
//     this.p5.ellipse(0, 0, dist, dist, [50]);
//     this.p5.pop();
//   }


// drawConnections() {
//     this.connections.forEach((connection) => {
//       this.p5.stroke(0, 250, 0);
//       this.p5.beginShape();
//       connection.forEach((point) => {
//         this.p5.vertex(point.x, point.y, point.z);
//       });
//       this.p5.endShape(this.p5.CLOSE);
//     });
//   }

export default Connections;