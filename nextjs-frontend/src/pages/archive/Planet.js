import convexHull from "convex-hull";
import { v4 as uuidv4 } from "uuid";
import { mat4, vec4, vec3 } from "gl-matrix";

import Point from "./Point";

class Planet {
  constructor(
    p5,
    {
      id = this.generatedId(),
      distance,
      centralPoint,
      data,
      mode = "ring",
      rotationAngles = { angleX: 0, angleY: 0, angleZ: 0 },
      orbitRadii = { rx: distance, ry: distance },
      camera,
      showOrbit = true,
      showPlanet = true,
      mouseHover = true,
      rotationSpeed = 0.1,
      selfRotation = false,
      planeColumns = 10,
      stripeSettings = {
        maxPerRing: 60,
        layerDistance: 10,
        layerRotation: 10,
      },
    }
  ) {
    this.id = id;
    this.p5 = p5;
    this.distance = distance;
    this.n = data.length;
    this.centralPoint = centralPoint;
    this.mode = mode;

    this.planeColumns = planeColumns;
    this.orbitRadii = orbitRadii;
    this.stripeSettings = stripeSettings;

    this.rotationAngles = {
      angleX: this.p5.radians(rotationAngles.angleX),
      angleY: this.p5.radians(rotationAngles.angleY),
      angleZ: this.p5.radians(rotationAngles.angleZ),
    };
    this.selfRotation = selfRotation;

    this.camera = camera;

    this.rayDirection = null;
    this.rayOrigin = null;

    this.renderPoints = [];

    this.options = {
      showOrbit,
      showPlanet,
      mouseHover,
    };

    this.rotationSpeed = rotationSpeed;

    switch (this.mode) {
      case "ring":
        this.generateRingSubpoints(data);
        break;
      case "plane":
        this.generatePlaneSubpoints(data);
        break;
      case "stripe":
        this.generateStripeSubpoints(data);
        break;
      default:
    }
  }

  generatedId() {
    return uuidv4();
  }

  generatePlaneSubpoints(data) {
    const { centralPoint, planeColumns, n, rotationAngles, distance, p5, renderPoints } = this;

    const rows = Math.ceil(n / planeColumns);

    const tmpPoints = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < planeColumns; j++) {
        if (tmpPoints.length >= n) break;
        const x = j * distance;
        const y = i * distance;
        const z = 0;
        const point = p5.createVector(x, y, z);
        tmpPoints.push(point);
      }
    }

    const centerX = ((planeColumns - 1) * distance) / 2;
    const centerY = ((rows - 1) * distance) / 2;
    for (let i = 0; i < tmpPoints.length; i++) {
      tmpPoints[i].x -= centerX;
      tmpPoints[i].y -= centerY;
      tmpPoints[i].x += centralPoint.x;
      tmpPoints[i].y += centralPoint.y;
      tmpPoints[i].z += centralPoint.z;
    }

    const cosX = Math.cos(rotationAngles.angleX);
    const sinX = Math.sin(rotationAngles.angleX);
    const cosY = Math.cos(rotationAngles.angleY);
    const sinY = Math.sin(rotationAngles.angleY);
    const cosZ = Math.cos(rotationAngles.angleZ);
    const sinZ = Math.sin(rotationAngles.angleZ);

    for (let i = 0; i < tmpPoints.length; i++) {
      let { x, y, z } = tmpPoints[i];

      let y1 = y * cosX - z * sinX;
      let z1 = y * sinX + z * cosX;
      y = y1;
      z = z1;

      let x1 = x * cosY + z * sinY;
      z1 = -x * sinY + z * cosY;
      x = x1;
      z = z1;

      x1 = x * cosZ - y * sinZ;
      y1 = x * sinZ + y * cosZ;
      x = x1;
      y = y1;

      const point = p5.createVector(x, y, z);
      point.id = data && data[i].id ? data[i].id : this.generatedId();
      this.renderPoints.push(new Point(point, data && data[i].id ? data[i].id : this.generatedId(), {}, this.p5));
    }
  }

  generateRingSubpoints(data) {
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
      point.id = data && data[i].id ? data[i].id : this.generatedId();
      this.renderPoints.push(new Point(point, data && data[i].id ? data[i].id : this.generatedId(), {}, this.p5));
    }
  }

  generateStripeSubpoints(data, maxPerRing = 60, layerDistance = 10, layerRotation = 10) {
    let { angleX, angleY, angleZ } = this.rotationAngles;
    let { rx, ry } = this.orbitRadii;

    let nLayers = Math.ceil(this.n / this.stripeSettings.maxPerRing);

    for (let j = 0; j < nLayers; j++) {
      let currentRotation = j * this.stripeSettings.layerRotation * (this.p5.PI / 180);
      let layerOffset = j * this.stripeSettings.layerDistance;

      for (let i = 0; i < this.stripeSettings.maxPerRing; i++) {
        let theta = (2 * this.p5.PI * i) / this.stripeSettings.maxPerRing;
        let x = rx * this.p5.cos(theta);
        let y = ry * this.p5.sin(theta);
        let z = layerOffset;

        let point = this.p5.createVector(x, y, z);
        point = this.rotateVector(point, angleX, angleY + currentRotation, angleZ);
        point.add(this.centralPoint);

        let index = j * this.stripeSettings.maxPerRing + i;
        point.id = data && data[index] && data[index].id ? data[index].id : this.generatedId();
        this.renderPoints.push(new Point(point, data && data[index] && data[index].id ? data[index].id : this.generatedId(), {}, this.p5));
      }
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

  checkRaySphereIntersections(pointObjects, options = {}) {
    // Convert mouse coordinates to NDC
    const points = pointObjects.map((p) => p.getVector());

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
      let t = this.raySphereIntersect(this.rayOrigin, this.rayDirection, p, options?.hitBox ? options.hitBox : 10);
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
    let viewDir = this.p5
      .createVector(camera.centerX - camera.eyeX, camera.centerY - camera.eyeY, camera.centerZ - camera.eyeZ)
      .normalize();

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

  updateRotation() {
    this.rotationAngles.angleX += this.p5.radians(this.rotationSpeed);
    this.rotationAngles.angleY -= this.p5.radians(this.rotationSpeed);
    this.rotationAngles.angleZ += this.p5.radians(this.rotationSpeed);
  }

  draw() {
    if (this.selfRotation) {
      this.updateRotation();
      this.p5.push();
      this.p5.translate(this.centralPoint.x, this.centralPoint.y, this.centralPoint.z);
      //this.p5.rotateX(this.rotationAngles.angleX);
      this.p5.rotateY(this.rotationAngles.angleY);
      //this.p5.rotateZ(this.rotationAngles.angleZ);
      this.p5.translate(-this.centralPoint.x, -this.centralPoint.y, -this.centralPoint.z);
    }

    if (!this.options.showPlanet) {
      if (this.selfRotation) this.p5.pop();
      return;
    }

    if (!this.options.showOrbit) {
      if (this.selfRotation) this.p5.pop();
      return;
    }

    let allPoints = [];

    this.p5.noStroke();
    if (this.mode === "ring" || this.mode === "plane" || this.mode === "stripe") {
      allPoints = this.renderPoints.map((p) => p.getVector());

      this.renderPoints.forEach((p, i) => {
        p.draw();
      });
    }

    if (this.options.mouseHover) {
      let hoveredSphere = this.checkRaySphereIntersections(this.renderPoints, { hitBox: 4 });
      this.setPointToHover(hoveredSphere?.id);
    }

    if (this.selfRotation) this.p5.pop();
  }

  setPointToHover(id) {
    this.renderPoints.forEach((p) => {
      p.setHover(p.getId() === id);
    });
  }

  getActiveIds() {
    return this.renderPoints.map((p) => (p.getActive() ? p.getId() : null)).filter((p) => p !== null);
  }
  setIdActive(aId) {
    this.renderPoints.find((p) => p.getId() === aId)?.setActive(true)
  }
  showHiddenId(id) {
    this.renderPoints.find((p) => p.getId() === id)?.setHidden(false);
  }
  hideActiveId(id) {
    this.renderPoints.find((p) => p.getId() === id)?.setHidden(true);
  }
  setActiveIds(aIds) {
    aIds.forEach((aId) => {
     this.renderPoints.find((p) => p.getId() === aId)?.setActive(true);
    });
  }
  resetActiveIds() {
    this.renderPoints.forEach((p) => p.setActive(false));
  }
  getHoverId() {
    return this.renderPoints.find((p) => p.getHover())?.getId();
  }

  getPoints() {
    return this.points;
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

  getPointById(id) {
    let found;

    if (this.id === id) {
      found = this.p5.createVector(this.centralPoint.x, this.centralPoint.y, this.centralPoint.z);
      found.id = this.id;
    }

    if (!found && this.renderPoints) {
      found = this.renderPoints.find((point) => point.getId() === id)?.getVector();
    }

    return found;
  }

  getRotatedPointById(id) {
    // Find the point by id
    const point = this.getPointById(id);
    if (!point || point.x == null || point.y == null || point.z == null) {
      console.error("Point not found or invalid:", point);
      return null;
    }

    // Convert point coordinates to numbers
    const x = Number(point.x);
    const y = Number(point.y);
    const z = Number(point.z);

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      console.error("Point coordinates are NaN:", { x, y, z });
      return null;
    }

    // Create a vec3 from the point coordinates
    const position = vec3.fromValues(x, y, z);

    // Get rotation angles in radians
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const angleX = toRadians(this.rotationAngles.x || 0);
    const angleY = toRadians(this.rotationAngles.y || 0);
    const angleZ = toRadians(this.rotationAngles.z || 0);

    if (isNaN(angleX) || isNaN(angleY) || isNaN(angleZ)) {
      console.error("Rotation angles are NaN:", this.rotationAngles);
      return null;
    }

    // Create a rotation matrix
    const rotationMatrix = mat4.create();
    mat4.rotateX(rotationMatrix, rotationMatrix, angleX);
    mat4.rotateY(rotationMatrix, rotationMatrix, angleY);
    mat4.rotateZ(rotationMatrix, rotationMatrix, angleZ);

    // Apply the rotation to the position
    vec3.transformMat4(position, position, rotationMatrix);

    // Return the rotated position
    const ret = this.p5.createVector(position[0], position[1], position[2]);
    ret.id = id;

    return ret;
  }
}

export default Planet;
