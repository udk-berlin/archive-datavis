import convexHull from "convex-hull";


class Orbit {
    constructor(p5, { distance, centralPoint, data }) {
      this.p5 = p5;
      this.distance = distance;
      this.n = data.length;
      this.centralPoint = centralPoint;

      this.points = this.createOrbit({ distance, n: this.n, centralPoint });
      this.displacedPoints = this.createDisplacedPoints({ _points: this.points, distances: data });
      console.log(this.points);
      console.log(this.displacedPoints);

      this.pointsHull = convexHull(this.points);
      this.displacedPointsHull = convexHull(this.displacedPoints);
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

    drawTriangles({ p, h, drawHull  }) {
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
      this.drawTriangles({ p: this.points, h : this.pointsHull, drawHull: false });
      this.drawTriangles({ p: this.displacedPoints, h: this.displacedPointsHull, drawHull: false });

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
        this.p5.fill(0, 0, 255);
        this.p5.translate(p[0], p[1], p[2]);
        this.p5.pop();
      });

      this.p5.fill(0, 0, 255);
      this.points.forEach((p) => {
        this.p5.push();
        this.p5.fill(0, 0, 255);
        this.p5.translate(p[0], p[1], p[2]);
        this.p5.sphere(1);
        this.p5.pop();
      });

      this.p5.fill(0, 0, 255);

      this.displacedPoints.forEach((p, i) => {
        this.p5.push();
        this.p5.fill(0, 0, 255);
        this.p5.translate(p[0], p[1], p[2]);
        this.p5.sphere(1);
        this.p5.pop();
      });

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
  }

  export default Orbit;