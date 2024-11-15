import convexHull from "convex-hull";

class Planet {
  constructor(p5, { distance, centralPoint, data, mode = "displacment" , displacementDistance = 5, rotationAngles = { angleX: 0, angleY: 0, angleZ: 0 } }) {
    this.p5 = p5;
    this.distance = distance;
    this.n = data.length;
    this.centralPoint = centralPoint;
    this.mode = mode;
    this.points = this.create3dOrbit({ distance, n: this.n, centralPoint });
    this.rotationAngles = {
      angleX: this.p5.radians(rotationAngles.angleX),
      angleY: this.p5.radians(rotationAngles.angleY),
      angleZ: this.p5.radians(rotationAngles.angleZ),
    };

    this.pointsHull = convexHull(this.points);
    this.displacementDistance = displacementDistance

    this.subpoints = [];

    switch (this.mode) {
      case "displacement":
        this.displacedPoints = this.createDisplacedPoints({ _points: this.points, distances: data });
        this.displacedPointsHull = convexHull(this.displacedPoints);
        break;
      case "line":
        this.displacedPoints = this.createDisplacedPoints({ _points: this.points, distances: data });
        this.points.forEach((point, i) => {
          let p = p5.createVector(point[0], point[1], point[2]);
          let n = data[i].projects.length;
          let direction = p5.constructor.Vector.sub(p, this.centralPoint);
          let unitDirection = direction.normalize();
          let points = [];
          for (let i = 1; i <= n; i++) {
            let newPoint = p5.constructor.Vector.add(p, p5.constructor.Vector.mult(unitDirection, this.displacementDistance * i));
            this.subpoints.push(newPoint);
          }
        });
        break;
      case "ring":
        this.generateRingSubpoints();
        console.log(this.subpoints);
      break;
      default:
    }
  }

  generateRingSubpoints() {
    let angleX = this.rotationAngles.angleX;
    let angleY = this.rotationAngles.angleY;
    let angleZ = this.rotationAngles.angleZ;

    for (let i = 0; i < this.n; i++) {
      let theta = (2 * this.p5.PI * i) / this.n;

      // Punktposition in der lokalen Orbits-Ebene vor der Rotation
      let x = this.distance * this.p5.cos(theta);
      let y = this.distance * this.p5.sin(theta);
      let z = 0;

      // Erstellen eines Vektors für den Punkt
      let point = this.p5.createVector(x, y, z);

      // Rotieren des Punkts um die X-, Y- und Z-Achse
      point = this.rotateVector(point, angleX, angleY, angleZ);

      // Verschieben des Punkts zum Zentralpunkt
      point.add(this.centralPoint);

      // Hinzufügen des Punkts zu subpoints
      this.subpoints.push(point);
    }
  }

  // Methode zur Sicherstellung, dass ein Objekt ein p5.Vector ist
  ensureVector(point) {
    if (point instanceof this.p5.constructor.Vector) {
      return point;
    } else if (Array.isArray(point) && point.length === 3) {
      return this.p5.createVector(point[0], point[1], point[2]);
    } else {
      throw new Error("centralPoint muss ein p5.Vector oder ein Array der Länge 3 sein.");
    }
  }

  // Methode zum Rotieren eines Vektors um gegebene Winkel
  rotateVector(v, angleX, angleY, angleZ) {
    let rotated = v.copy();
    // Rotation um die X-Achse
    rotated = this.rotateAroundX(rotated, angleX);
    // Rotation um die Y-Achse
    rotated = this.rotateAroundY(rotated, angleY);
    // Rotation um die Z-Achse
    rotated = this.rotateAroundZ(rotated, angleZ);
    return rotated;
  }

  // Rotationsfunktionen um jede Achse
  rotateAroundX(v, angle) {
    let cosA = this.p5.cos(angle);
    let sinA = this.p5.sin(angle);
    let y = v.y * cosA - v.z * sinA;
    let z = v.y * sinA + v.z * cosA;
    return this.p5.createVector(v.x, y, z);
  }

  rotateAroundY(v, angle) {
    let cosA = this.p5.cos(angle);
    let sinA = this.p5.sin(angle);
    let x = v.x * cosA + v.z * sinA;
    let z = -v.x * sinA + v.z * cosA;
    return this.p5.createVector(x, v.y, z);
  }

  rotateAroundZ(v, angle) {
    let cosA = this.p5.cos(angle);
    let sinA = this.p5.sin(angle);
    let x = v.x * cosA - v.y * sinA;
    let y = v.x * sinA + v.y * cosA;
    return this.p5.createVector(x, y, v.z);
  }

  create3dOrbit({ distance, n, centralPoint }) {
    const _points = [];
    for (let i = 0; i < n; i++) {
      let theta = this.p5.acos(1 - (2 * (i + 0.5)) / n);
      let phi = i * this.p5.PI * (3 - this.p5.sqrt(5));

      let x = this.centralPoint.x + distance * this.p5.sin(theta) * this.p5.cos(phi);
      let y = this.centralPoint.y + distance * this.p5.sin(theta) * this.p5.sin(phi);
      let z = this.centralPoint.z + distance * this.p5.cos(theta);

      _points.push([x, y, z]);
    }

    return _points;
  }

  createDisplacedPoints({ _points, distances }) {
    const newPoints = _points.map((point, i) => {
      const direction = this.p5.createVector(
        point[0] - this.centralPoint.x,
        point[1] - this.centralPoint.y,
        point[2] - this.centralPoint.z
      );

      direction.normalize();

      const extensionLength = (distances[i] ? distances[i] * 3 : 1) || 1;
      const extendedDirection = direction.mult(extensionLength);

      const newEndPoint = this.p5.createVector(
        point[0] + extendedDirection.x,
        point[1] + extendedDirection.y,
        point[2] + extendedDirection.z
      );

      return [newEndPoint.x, newEndPoint.y, newEndPoint.z];
    });

    return newPoints;
  }

  drawTriangles({ p, h, drawHull }) {
    const hull = h ? h : convexHull(p);
    if (drawHull) {
      hull.forEach((face, i) => {
        const [a, b, c] = face;

        this.p5.beginShape(p5.TRIANGLES);
        this.p5.vertex(p[a][0], p[a][1], p[a][2]);
        this.p5.vertex(p[b][0], p[b][1], p[b][2]);
        this.p5.vertex(p[c][0], p[c][1], p[c][2]);
        this.p5.endShape();
      });
    }

    return hull;
  }

  draw() {
    this.drawTriangles({ p: this.points, h: this.pointsHull, drawHull: false });

    switch (this.mode) {
      case "displacement":
        this.drawTriangles({ p: this.displacedPoints, h: this.displacedPointsHull, drawHull: false });
        break;
      default:
    }

    this.p5.push();
    this.p5.fill(255, 0, 0);
    this.p5.translate(this.centralPoint.x, this.centralPoint.y, this.centralPoint.z);
    this.p5.sphere(1);
    this.p5.pop();

    this.p5.noFill();

    this.p5.stroke(0, 0, 0, 50);
    //p5.fill(255,0,0)

    this.p5.push();
    this.p5.translate(this.centralPoint.x, this.centralPoint.y, this.centralPoint.z);
    this.p5.strokeWeight(2);
    this.p5.stroke(255, 0, 0);

    this.p5.stroke(0, 0, 0);
    this.p5.pop();

    
  

    switch (this.mode) {
      case "displacement":
        this.points.forEach((p, i) => {
          this.p5.push();
          this.p5.translate(p[0], p[1], p[2]);
          this.p5.fill(0, 0, 255);
          this.p5.sphere(1);
          this.p5.pop();
        });

        this.displacedPoints.forEach((p, i) => {
          this.p5.push();
          this.p5.fill(0, 0, 255);
          this.p5.translate(p[0], p[1], p[2]);
          this.p5.sphere(1);
          this.p5.pop();
        });

        this.points.forEach((p, i) => {
          this.p5.stroke(255, 0, 0);
          this.p5.line(p[0], p[1], p[2], this.displacedPoints[i][0], this.displacedPoints[i][1], this.displacedPoints[i][2]);
        });
        break;
      case "line":
        // this.points.forEach((p, i) => {
        //   this.p5.stroke(255, 0, 0);
        //   this.p5.line(p[0], p[1], p[2], this.displacedPoints[i][0], this.displacedPoints[i][1], this.displacedPoints[i][2]);
        // });

        this.points.forEach((p, i) => {
          this.p5.push();
          this.p5.translate(p[0], p[1], p[2]);
          this.p5.fill(0, 0, 255);
          this.p5.sphere(1);
          this.p5.pop();
        });

        this.subpoints.forEach((p, i) => {
          this.p5.push();
          this.p5.fill(0, 0, 255);
          this.p5.translate(p.x, p.y, p.z);
          this.p5.sphere(0.1);
          this.p5.pop();
        });
        break;

      case "ring":
        this.subpoints.forEach((p, i) => {
          this.p5.push();
          this.p5.fill(0, 0, 255);
          this.p5.translate(p.x, p.y, p.z);
          this.p5.sphere(0.1);
          this.p5.pop();
        });
        break;
      default:
    }

    // points.forEach( (p,i) => {
    //   p5.stroke(255,0,0)
    //   p5.line(p[0], p[1], p[2], displacedPoints[i][0], displacedPoints[i][1], displacedPoints[i][2]);
    // })

    // this.p5.fill(0, 0, 0);
    // if (img) {
    //   this.p5.push();
    //   this.p5.noStroke();
    //   this.p5.noLights();
    //   this.p5.translate(0, 250, 0);
    //   this.p5.rotateX(p5.HALF_PI);
    //   this.p5.texture(img);
    //   this.p5.plane(400, 400);
    //   this.p5.pop();
    // }
  }

  getPoints() {
    return this.points;
  }
  getDisplacedPoints() {
    return this.displacedPoints;
  }

  getDistance() {
    return this.distance;
  }

  getCentralPoint() {
    return this.centralPoint;
  }

  getAmountOfPoints() {
    return this.n;
  }
}

export default Planet;
