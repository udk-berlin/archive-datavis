import convexHull from "convex-hull";
import crypto from "crypto";
import { mat4, vec4 } from "gl-matrix";

class Planet {
  constructor(
    p5,
    {
      id = crypto.randomBytes(16).toString("hex"),
      distance,
      centralPoint,
      data,
      mode = "displacment",
      displacementDistance = 5,
      rotationAngles = { angleX: 0, angleY: 0, angleZ: 0 },
      orbitRadii = { rx: distance, ry: distance },
      camera,
    }
  ) {
    this.p5 = p5;
    this.distance = distance;
    this.n = data.length;
    this.centralPoint = centralPoint;
    this.mode = mode;
    this.orbitRadii = orbitRadii;
    this.points = this.create3dOrbit({ distance, n: this.n, centralPoint });
    this.rotationAngles = {
      angleX: this.p5.radians(rotationAngles.angleX),
      angleY: this.p5.radians(rotationAngles.angleY),
      angleZ: this.p5.radians(rotationAngles.angleZ),
    };

    this.pointsHull = convexHull(this.points);
    this.displacementDistance = displacementDistance;
    this.camera = camera;

    this.rayDirection = null;
    this.rayOrigin = null;

    this.subpoints = [];

    switch (this.mode) {
      case "displacement":
        this.displacedPoints = this.createDisplacedPoints({ _points: this.points, distances: data.map((d) => d.children.length) });
        this.displacedPointsHull = convexHull(this.displacedPoints);
        break;
      case "line":
        this.points.forEach((point, i) => {
          let p = p5.createVector(point[0], point[1], point[2]);
          let n = data[i].children.length;
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
        break;
      default:
    }
  }

  

  generateRingSubpoints() {
    let { angleX, angleY, angleZ } = this.rotationAngles;
    let { rx, ry } = this.orbitRadii;

    for (let i = 0; i < this.n; i++) {
      let theta = (2 * this.p5.PI * i) / this.n;
      let x = rx * this.p5.cos(theta);
      let y = ry * this.p5.sin(theta);
      let z = 0;
      let point = this.p5.createVector(x, y, z);
      point = this.rotateVector(point, angleX, angleY, angleZ);
      point.add(this.centralPoint);
      this.subpoints.push(point);
    }
  }

  ensureVector(point) {
    if (point instanceof this.p5.constructor.Vector) {
      return point;
    } else if (Array.isArray(point) && point.length === 3) {
      return this.p5.createVector(point[0], point[1], point[2]);
    } else {
      throw new Error("not a 3d vector");
    }
  }

  rotateVector(v, angleX, angleY, angleZ) {
    let rotated = v.copy();
    rotated = this.rotateAroundX(rotated, angleX);
    rotated = this.rotateAroundY(rotated, angleY);
    rotated = this.rotateAroundZ(rotated, angleZ);
    return rotated;
  }

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

  drawOrbitEllipse() {
    let { angleX, angleY, angleZ } = this.rotationAngles;
    let { rx, ry } = this.orbitRadii;
    let p5 = this.p5;
    let centralPoint = this.centralPoint;

    let numSegments = 100;

    p5.push();
    p5.noFill();
    p5.stroke(0, 0, 255);
    p5.strokeWeight(0.1);

    p5.beginShape();
    for (let i = 0; i <= numSegments; i++) {
      let theta = (2 * p5.PI * i) / numSegments;

      let x = rx * p5.cos(theta);
      let y = ry * p5.sin(theta);
      let z = 0;

      let point = p5.createVector(x, y, z);

      point = this.rotateVector(point, angleX, angleY, angleZ);

      point.add(centralPoint);

      p5.vertex(point.x, point.y, point.z);
    }
    p5.endShape();
    p5.pop();
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

 
 checkRaySphereIntersections(points) {
  // Convert mouse coordinates to NDC
  let ndcX = (this.p5.mouseX / this.p5.width) * 2 - 1;
  let ndcY = 1 - (this.p5.mouseY / this.p5.height) * 2; // Invert Y axis

  // Access the renderer
  let renderer = this.p5._renderer;

  // Get the projection and model-view matrices
  let projMatrix = renderer._curCamera.projMatrix.mat4;
  let viewMatrix = renderer._curCamera.cameraMatrix.mat4;

  // Combine the projection and view matrices
  let pvMatrix = mat4.create();
  mat4.multiply(pvMatrix, projMatrix, viewMatrix);

  // Compute the inverse of the combined matrix
  let inversePVMatrix = mat4.create();
  let success = mat4.invert(inversePVMatrix, pvMatrix);
  if (!success) {
    console.error("Could not invert the matrix");
    return null;
  }

  // NDC coordinates with z = -1 (near plane), w = 1
  let ndcNear = [ndcX, ndcY, -1, 1];
  // NDC coordinates with z = 1 (far plane), w = 1
  let ndcFar = [ndcX, ndcY, 1, 1];

  // Transform the NDC points to world coordinates
  let worldNear = vec4.create();
  let worldFar = vec4.create();
  vec4.transformMat4(worldNear, ndcNear, inversePVMatrix);
  vec4.transformMat4(worldFar, ndcFar, inversePVMatrix);

  // Perspective divide to get 3D coordinates
  for (let i = 0; i < 3; i++) {
    worldNear[i] /= worldNear[3];
    worldFar[i] /= worldFar[3];
  }

  // Create p5.Vectors for the world points
  this.rayOrigin = this.p5.createVector(worldNear[0], worldNear[1], worldNear[2]);
  let rayEnd = this.p5.createVector(worldFar[0], worldFar[1], worldFar[2]);


  // Ray direction from near to far point
  this.rayDirection = this.p5.constructor.Vector.sub(rayEnd, this.rayOrigin).normalize();

  let closestSphere = null;
  let minDistance = Infinity;

  // Iterate through all spheres to find intersections
  for (let p of points) {
    let t = this.raySphereIntersect(this.rayOrigin, this.rayDirection, p, 10);
    if (t !== null && t < minDistance) {
      minDistance = t;
      closestSphere = p;
    }
  }

  if (closestSphere !== null) {
    // Return the closest intersected sphere
    return closestSphere;
  } else {
    return null;
  }
}

 drawMousePointOnPlane(camera) {
  if (this.rayDirection === null || this.rayOrigin === null) {
    return;
  }
  // Camera position
  let eye = this.p5.createVector(camera.eyeX, camera.eyeY, camera.eyeZ);

  // Camera view direction (normalized)
  let viewDir = this.p5.createVector(
    camera.centerX - camera.eyeX,
    camera.centerY - camera.eyeY,
    camera.centerZ - camera.eyeZ
  ).normalize();

  // Define the plane distance from the camera
  let planeDistance = 500; // Adjust as needed

  // Plane point (P) at a distance along the view direction
  let planePoint = this.p5.constructor.Vector.add(eye, this.p5.constructor.Vector.mult(viewDir, planeDistance));

  // Plane normal (same as view direction)
  let planeNormal = viewDir;

  // Compute denominator of the intersection formula
  let denom = this.rayDirection.dot(planeNormal);

  if (this.p5.abs(denom) > 1e-6) {
    // Compute t (distance along the ray to the intersection point)
    let t = this.p5.constructor.Vector.sub(planePoint, this.rayOrigin).dot(planeNormal) / denom;
    if (t >= 0) {
      // Intersection point
      let intersectionPoint = this.p5.constructor.Vector.add(this.rayOrigin, this.p5.constructor.Vector.mult(this.rayDirection, t));

      // Draw a small sphere at the intersection point
      this.p5.push();
      this.p5.translate(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z);
      this.p5.fill(0, 255, 0); // Green color
      this.p5.sphere(2); // Small sphere
      this.p5.pop();
    }
  }
}

 raySphereIntersect(O, D, C, r) {
  let OC = this.p5.constructor.Vector.sub(O, C);

  let a = D.dot(D); // Should be 1 since D is normalized
  let b = 2 * D.dot(OC);
  let c = OC.dot(OC) - r * r;

  let discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    // No intersection
    return null;
  } else {
    // Compute the two possible intersection distances
    let sqrtDisc = this.p5.sqrt(discriminant);
    let t1 = (-b - sqrtDisc) / (2 * a);
    let t2 = (-b + sqrtDisc) / (2 * a);

    // We are interested in the smallest positive t
    if (t1 >= 0 && t2 >= 0) {
      return this.p5.min(t1, t2);
    } else if (t1 >= 0) {
      return t1;
    } else if (t2 >= 0) {
      return t2;
    } else {
      // Both intersections are behind the ray origin
      return null;
    }
  }
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

    this.p5.push();
    this.p5.translate(this.centralPoint.x, this.centralPoint.y, this.centralPoint.z);
    this.p5.strokeWeight(2);
    this.p5.stroke(255, 0, 0);

    this.p5.stroke(0, 0, 0);
    this.p5.pop();



    // Collect all relevant points based on mode
    let allPoints = [];

   // this.drawMousePointOnPlane(this.p5._renderer._curCamera);


    switch (this.mode) {
      case "displacement":
        this.points.forEach((p) => {
          allPoints.push(this.p5.createVector(p[0], p[1], p[2]));
        });
        this.displacedPoints.forEach((p) => {
          allPoints.push(this.p5.createVector(p[0], p[1], p[2]));
        });
        break;
      case "line":
        this.points.forEach((p) => {
          allPoints.push(this.p5.createVector(p[0], p[1], p[2]));
        });
        allPoints = allPoints.concat(this.subpoints);
        break;
      case "ring":
        allPoints = allPoints.concat(this.subpoints);
        break;
      default:
        // Add other modes if necessary
        break;
    }

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
        this.drawOrbitEllipse();

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

     let hoveredSphere = this.checkRaySphereIntersections(allPoints);

    if (hoveredSphere) {
      this.p5.push();
      this.p5.fill(255, 0, 0);
      this.p5.translate(hoveredSphere.x, hoveredSphere.y, hoveredSphere.z);
      this.p5.sphere(5);
      this.p5.pop();
    }

 
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

  getId() {
    return this.id;
  }
}



export default Planet;
