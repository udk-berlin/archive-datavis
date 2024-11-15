import convexHull from "convex-hull";

class Planet {
  constructor(p5, { distance, centralPoint, data, mode = "displacment" }) {
    this.p5 = p5;
    this.distance = distance;
    this.n = data.length;
    this.centralPoint = centralPoint;
    this.mode = mode;
    this.points = this.createOrbit({ distance, n: this.n, centralPoint });

    this.pointsHull = convexHull(this.points);

    this.subpoints = []

    switch (this.mode) {
      case "displacement":
        this.displacedPoints = this.createDisplacedPoints({ _points: this.points, distances: data });
        this.displacedPointsHull = convexHull(this.displacedPoints);
        break;
      case "line": 

        this.displacedPoints = this.createDisplacedPoints({ _points: this.points, distances: data });
        
        this.points.forEach((point, i) => {
          // let a = p5.createVector(point[0], point[1], point[2]); 
          // let b = p5.createVector(this.displacedPoints[i][0], this.displacedPoints[i][1], this.displacedPoints[i][2]);
          // let n = data[i].projects.length;

          // for (let i = 1; i <= n; i++) {
          //   let t = i / (n + 1);
          //   let subpoint = p5.constructor.Vector.lerp(a, b, t);
          //   this.subpoints.push(subpoint);
          // }

          let p = p5.createVector(point[0], point[1], point[2]);
          let n = data[i].projects.length;
          let direction =  p5.constructor.Vector.sub(p, this.centralPoint);
          let unitDirection = direction.normalize();
        
          // Erzeugen Sie die Punkte
          let points = [];
          for (let i = 1; i <= n; i++) {
            let newPoint = p5.constructor.Vector.add(p, p5.constructor.Vector.mult(unitDirection, 5 * i));
            this.subpoints.push(newPoint);
          }



        });


       
      
      break;
      default:
    }
  }

  createOrbit({ distance, n, centralPoint }) {
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

    this.points.forEach((p, i) => {
      this.p5.push();
      this.p5.translate(p[0], p[1], p[2]);
      this.p5.fill(0, 0, 255);
      this.p5.sphere(1);
      this.p5.pop();
    });

    switch (this.mode) {
      case "displacement":
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

        this.subpoints.forEach((p, i) => {
          this.p5.push();
          this.p5.fill(0, 0, 255);
          this.p5.translate(p.x, p.y, p.z);
          this.p5.sphere(.1);
          this.p5.pop();
        })
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
