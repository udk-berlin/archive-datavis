import dynamic from "next/dynamic";
import convexHull from "convex-hull";

import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import { addScreenPositionFunction } from "./screenPosition";
import { useState } from "react";

const Sketch = dynamic(() => import("react-p5"), {
  ssr: false,
});

const P5Test = () => {
  let papertexture;

  const [points, setPoints] = useState([]);
  const [displacedPoints, setDisplacesPoints] = useState([]);
  const [centralPoint, setCentralPoint] = useState({ x: 0, y: 0, z: 0 });

  const [img, setImg] = useState();

  const preload = (p5) => {
    setImg(p5.loadImage("/images/floatingShadow.png"));
    // papertexture = p5.loadImage("");
  };

  const pointInTriangle = (px, py, ax, ay, bx, by, cx, cy) => {
    const v0x = cx - ax;
    const v0y = cy - ay;
    const v1x = bx - ax;
    const v1y = by - ay;
    const v2x = px - ax;
    const v2y = py - ay;

    const dot00 = v0x * v0x + v0y * v0y;
    const dot01 = v0x * v1x + v0y * v1y;
    const dot02 = v0x * v2x + v0y * v2y;
    const dot11 = v1x * v1x + v1y * v1y;
    const dot12 = v1x * v2x + v1y * v2y;

    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return u >= 0 && v >= 0 && u + v < 1;
  };

  const createOrbit = (p5, { distance, n, centralPoint }) => {
    const _points = [];
    for (let i = 0; i < n; i++) {
      let theta = p5.acos(1 - (2 * (i + 0.5)) / n);
      let phi = i * p5.PI * (3 - p5.sqrt(5));

      let x = centralPoint.x + distance * p5.sin(theta) * p5.cos(phi);
      let y = centralPoint.y + distance * p5.sin(theta) * p5.sin(phi);
      let z = centralPoint.z + distance * p5.cos(theta);

      _points.push([x, y, z]);
    }

    return _points;
  };

  const checkForHover = (p5, points) => {
    let mouseOverTriangle = false;

    if (pointInTriangle(p5.mouseX, p5.mouseY, screenA.x, screenA.y, screenB.x, screenB.y, screenC.x, screenC.y)) {
      mouseOverTriangle = true;
      const hull = convexHull(points);

      hull.forEach((face) => {
        const [a, b, c] = face;

        const ax = points[a][0];
        const ay = points[a][1];
        const az = points[a][2];
        const bx = points[b][0];
        const by = points[b][1];
        const bz = points[b][2];
        const cx = points[c][0];
        const cy = points[c][1];
        const cz = points[c][2];

        const screenA = p5.screenPosition(ax, ay, az);
        const screenB = p5.screenPosition(bx, by, bz);
        const screenC = p5.screenPosition(cx, cy, cz);

        if (pointInTriangle(p5.mouseX, p5.mouseY, screenA.x, screenA.y, screenB.x, screenB.y, screenC.x, screenC.y)) {
          mouseOverTriangle = true;
        }
      });
    }

    return { mouseOverTriangle, hull };
  };

  const drawTriangles = (p5, { p, h }) => {
    const hull = h ? h :  convexHull(p);
    
    //console.log(hull)
    hull.forEach((face,i) => {
      const [a, b, c] = face;

      //console.log(i,a)

      p5.beginShape(p5.TRIANGLES);
      p5.vertex(p[a][0], p[a][1], p[a][2]);
      p5.vertex(p[b][0], p[b][1], p[b][2]);
      p5.vertex(p[c][0], p[c][1], p[c][2]);
      p5.endShape();
    });

    return hull
  };

  const createTriangle = (p5, { a, b, c }) => {
    p5.beginShape(p5.TRIANGLES);
    p5.vertex(a[0], a[1], a[2]);
    p5.vertex(b[0], b[1], b[2]);
    p5.vertex(c[0], c[1], c[2]);
    p5.endShape();
  };

  const createDisplacedPoints = (p5, { _points, distances }) => {
    const newPoints = _points.map((point, i) => {
      const direction = p5.createVector(point[0] - centralPoint.x, point[1] - centralPoint.y, point[2] - centralPoint.z);

      direction.normalize();

      const extensionLength = (distances[i] ? distances[i] * 3 : 1) || 1;
      const extendedDirection = direction.mult(extensionLength);

      const newEndPoint = p5.createVector(point[0] + extendedDirection.x, point[1] + extendedDirection.y, point[2] + extendedDirection.z);

      return [newEndPoint.x, newEndPoint.y, newEndPoint.z];
    });

    return newPoints;
  };

  //   const createDisplacedPoints = (p5, { _points, distances }) => {
  //   const newPoints = _points.map((point, i) => {
  //     const direction = p5.createVector(point[0] - centralPoint.x, point[1] - centralPoint.y, point[2] - centralPoint.z);
  //     const extensionLength = distances[i]*0.1
  //     const extendedDirection = direction.mult(extensionLength);
  //     return [point[0] + extendedDirection.x, point[1] + extendedDirection.y, point[2] + extendedDirection.z];
  //   });
  //   return newPoints;
  // };

  // const drawTriangles = (p5, { p, h }) => {
  //   const points = p.map(point => new THREE.Vector3(point[0], point[1], point[2]));
  //   const geometry = new ConvexGeometry(points);

  //   const positionAttribute = geometry.getAttribute('position');

  //   for (let i = 0; i < positionAttribute.count; i += 3) {
  //     const a = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
  //     const b = new THREE.Vector3().fromBufferAttribute(positionAttribute, i + 1);
  //     const c = new THREE.Vector3().fromBufferAttribute(positionAttribute, i + 2);

  //     p5.beginShape(p5.TRIANGLES);
  //     p5.vertex(a.x, a.y, a.z);
  //     p5.vertex(b.x, b.y, b.z);
  //     p5.vertex(c.x, c.y, c.z);
  //     p5.endShape();
  //   }
  // };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(750, 750, p5.WEBGL).parent(canvasParentRef);
    addScreenPositionFunction(p5);

    setCentralPoint(p5.createVector(0, 0, 0));

    const initialPoints = createOrbit(p5, { distance: 100, n: 66, centralPoint });
    setPoints(initialPoints);

    // console.log(initialPoints);
    const displacedPoints = createDisplacedPoints(p5, {
      _points: initialPoints,
      distances: [
        1, 14, 4,  8,  3,  9,  9, 12, 7, 11,  5, 5,
       13, 11, 4, 10, 16,  9, 18,  7, 7,  9, 11, 3,
        8,  5, 9,  6, 12, 10,  7, 14, 2,  9,  4, 2,
        6,  6, 3,  3, 11,  5,  7,  6, 5,  6,  2, 0,
        2,  0, 2,  0,  0,  0,  0,  0, 0,  0,  0, 0,
        0,  0, 0,  0,  0, 57
     ],
    });
    //  console.log(displacedPoints);
    setDisplacesPoints(displacedPoints);
  };

  const draw = (p5) => {
    p5.background(236, 239, 241);

    p5.orbitControl();
    p5.ambientLight(150);
    p5.directionalLight(255, 255, 255, 1, 1, -1);

    p5.push();
    p5.fill(255, 0, 0);
    p5.translate(centralPoint.x, centralPoint.y, centralPoint.z);
    p5.sphere(1);
    p5.pop();

    p5.noFill();

    p5.stroke(0, 0, 0, 50);
    //p5.fill(255,0,0)
    const hO = drawTriangles(p5, { p: points });
    p5.stroke(0, 0, 0, 255);

    if (displacedPoints.length > 0) {
      //p5.fill(125,125,125,100)
      // drawTriangles(p5, { p: displacedPoints , h: hO});
    }

    p5.push();
    p5.translate(centralPoint.x, centralPoint.y, centralPoint.z);
    p5.strokeWeight(2);
    p5.stroke(255, 0, 0);
    // p5.beginShape();
    // p5.vertex(centralPoint.x, centralPoint.y, centralPoint.z);
    // p5.vertex(points[3][0], points[3][1], points[3][2]);
    // p5.endShape();

    // Draw the original line

    points.forEach((p, i) => {
      p5.line(centralPoint.x, centralPoint.y, centralPoint.z, points[i][0], points[i][1], points[i][2]);
      p5.line(points[i][0], points[i][1], points[i][2], displacedPoints[i][0], displacedPoints[i][1], displacedPoints[i][2]);
    });

    p5.stroke(0, 0, 0);
    p5.pop();

    points.forEach((p, i) => {
      p5.push();
      p5.fill(0, 0, 255);
      p5.translate(p[0], p[1], p[2]);

      // if (i < 3) {
      //   p5.sphere(10);
      // } else {
      //   p5.sphere(1);
      // }

      p5.pop();
    });

    p5.fill(0, 0, 255);

    function findClosestPointIndex(points, a, b, excludedIndexes) {
      let minDistance = Infinity;
      let closestPointIndex = -1;
  
      function euclideanDistance(point1, point2) {
          return Math.sqrt(
              Math.pow(point1[0] - point2[0], 2) +
              Math.pow(point1[1] - point2[1], 2) +
              Math.pow(point1[2] - point2[2], 2)
          );
      }
  
      for (let i = 0; i < points.length; i++) {
          if (excludedIndexes.includes(i)) {
              continue; // Skip excluded indexes
          }
  
          let distanceToA = euclideanDistance(points[i], a);
          let distanceToB = euclideanDistance(points[i], b);
          let totalDistance = distanceToA + distanceToB;
  
          if (totalDistance < minDistance) {
              minDistance = totalDistance;
              closestPointIndex = i;
          }
      }
  
      return closestPointIndex;
  }

    // let a = points[0];
    // let b = points[1];
    // let c = points[2];
    // let excludedIndexes = [0, 1];
    // createTriangle(p5, { a: a, b: b, c: c });

    // p5.push();
    // p5.translate(a[0], a[1], a[2]);
    // p5.sphere(2);
    // p5.pop();

    // p5.push();
    // p5.translate(b[0], b[1], b[2]);
    // p5.sphere(10);
    // p5.pop();


    // c = points[findClosestPointIndex(points, a, b, excludedIndexes)];
    // createTriangle(p5, { a: a, b: b, c: c });


    // excludedIndexes.push(findClosestPointIndex(points, a, b, excludedIndexes))
    // a = points[findClosestPointIndex(points, b, c, excludedIndexes)];
    // createTriangle(p5, { a: a, b: b, c: c });



    // let aI = 0
    // let bI = 1
    // let cI = 2
    // let excludedIndexes = [0, 1];

    // createTriangle(p5, { a: points[aI], b: points[bI], c: points[cI] });
    // for( let i = 0; i < points.length-3; i+=3) {

    //   let nAI = findClosestPointIndex(points, points[bI], points[cI], excludedIndexes)
    //   excludedIndexes.push(nAI)
    //   aI = nAI
    //   createTriangle(p5, { a: points[aI], b: points[bI], c: points[cI] });

    //   let nBI = findClosestPointIndex(points, points[aI], points[cI], excludedIndexes)
    //   excludedIndexes.push(nBI)
    //   bI = nBI
    //   createTriangle(p5, { a: points[aI], b: points[bI], c: points[cI] });

    //   let nCI = findClosestPointIndex(points, points[aI], points[bI], excludedIndexes)
    //   excludedIndexes.push(nCI)
    //   cI = nCI
    //   createTriangle(p5, { a: points[aI], b: points[bI], c: points[cI] });

    // }


    // -------------------------------



    



    // for ( let i = 0; i < points.length; i+=3) {
    //   let r = p5.random(0,10)
    //   let g = p5.random(0,10)
    //   let b = p5.random(0,10)

    //   // p5.push();
    //   // p5.fill(r,g,b)
    //   // p5.translate(points[i][0], points[i][1], points[i][2]);
    //   // p5.sphere(r);
    //   // p5.pop();

    //   // p5.push();
    //   // p5.translate(points[i+1][0], points[i+1][1], points[i+1][2]);
    //   // p5.sphere(r);
    //   // p5.pop();

    //   // p5.push();
    //   // p5.translate(points[i+2][0], points[i+2][1], points[i+2][2]);
    //   // p5.sphere(r);
    //   // p5.pop();

    //  createTriangle(p5, {a: points[i], b: points[i+1], c: points[i+2]})
    // }

    // p5.noLoop()

    // drawTriangles(p5, { p: displacedPoints });

    p5.fill(0, 0, 0);
    if (img) {
      p5.push();
      p5.noStroke();
      p5.noLights();
      p5.translate(0, 250, 0);
      p5.rotateX(p5.HALF_PI);
      p5.texture(img);
      p5.plane(800, 800);
      p5.pop();
    }
  };

  return <Sketch preload={preload} setup={setup} draw={draw} />;
};

export default P5Test;
