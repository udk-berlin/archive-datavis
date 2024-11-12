import dynamic from "next/dynamic";
import convexHull from "convex-hull";

import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import { addScreenPositionFunction } from "./screenPosition";
import { useState } from "react";

import { NextReactP5Wrapper } from "@p5-wrapper/next";

const P5Test = () => {

  let papertexture;



  // const [img, setImg] = useState();


 
  function sketch(p5) {

    let img
    let displacedPoints = []
    let points = []
    let centralPoint = { x: 0, y: 0, z: 0 }
    let camera


    const drawTriangles = ( { p, h }) => {
      const hull = h ? h : convexHull(p);
  
      //console.log(hull)
      hull.forEach((face, i) => {
        const [a, b, c] = face;
  
        //console.log(i,a)
  
        p5.beginShape(p5.TRIANGLES);
        p5.vertex(p[a][0], p[a][1], p[a][2]);
        p5.vertex(p[b][0], p[b][1], p[b][2]);
        p5.vertex(p[c][0], p[c][1], p[c][2]);
        p5.endShape();
      });
  
      return hull;
    };

    const createDisplacedPoints = ( { _points, distances }) => {
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


    const createOrbit = ( { distance, n, centralPoint }) => {
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

    p5.preload = () => {
      console.log("asd")
      img = p5.loadImage("/images/floatingShadow.png")
    }

    
    p5.setup = () => {
      p5.createCanvas(750, 750, p5.WEBGL)
      addScreenPositionFunction(p5);

      centralPoint = p5.createVector(0, 0, 0);

      let initialPoints = createOrbit( { distance: 100, n: 66, centralPoint });
      points = initialPoints;

      // console.log(initialPoints);
      let displacedPoints = createDisplacedPoints( {
        _points: initialPoints,
        distances: [
          1, 14, 4, 8, 3, 9, 9, 12, 7, 11, 5, 5, 13, 11, 4, 10, 16, 9, 18, 7, 7, 9, 11, 3, 8, 5, 9, 6, 12, 10, 7, 14, 2, 9, 4, 2, 6, 6, 3,
          3, 11, 5, 7, 6, 5, 6, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 57,
        ],
      });
      //  console.log(displacedPoints);
      displacedPoints= displacedPoints;

      camera = p5.createCamera();
    }

    p5.draw = () => {
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
      const hO = drawTriangles( { p: points });
      p5.stroke(0, 0, 0, 255);

      if (displacedPoints.length > 0) {
        //p5.fill(125,125,125,100)
        // drawTriangles(p5, { p: displacedPoints , h: hO});
      }

      p5.push();
      p5.translate(centralPoint.x, centralPoint.y, centralPoint.z);
      p5.strokeWeight(2);
      p5.stroke(255, 0, 0);



      p5.stroke(0, 0, 0);
      p5.pop();

      points.forEach((p, i) => {
        p5.push();
        p5.fill(0, 0, 255);
        p5.translate(p[0], p[1], p[2]);
        p5.pop();
      });

      p5.fill(0, 0, 255);

      let closestPoint = null;
      let minDist = Infinity;
      let minDistCamera = Infinity;

      const camPosX = camera.eyeX;
      const camPosY = camera.eyeY;
      const camPosZ = camera.eyeZ;

      const planePosX = 0;
      const planePosY = 0;
      const planePosZ = 0;

      const lookAtVector = p5.createVector(camPosX - planePosX, camPosY - planePosY, camPosZ - planePosZ);

      const angleY = p5.atan2(lookAtVector.x, lookAtVector.z);
      const angleX = p5.asin(lookAtVector.y / lookAtVector.mag());

      p5.push();
      p5.translate(planePosX, planePosY, planePosZ);
      p5.rotateY(angleY);
      p5.rotateX(-angleX);
      // p5.plane(100, 100);
      p5.ellipse(p5.mouseX - p5.width / 2, p5.mouseY - p5.height / 2, 10, 10);

      points.forEach((point, i) => {
        let d = p5.dist(p5.mouseX - p5.width / 2, p5.mouseY - p5.height / 2, point[0], point[1]);
        if (d <= 15) {
          let distToCamera = p5.dist(camera.eyeX, camera.eyeY, camera.eyeZ, point[0], point[1], point[2]);
          //console.log(distToCamera)
          if (distToCamera < minDistCamera) {
            //  console.log(i);
            minDistCamera = distToCamera;

            closestPoint = point;
          }
        }
      });

      p5.pop();


      const getClosestPointToMouse = (p) => {
        let closestIndex = -1;
        let minDistance = Infinity;

        // Kameraposition und Mausposition
        const camPos = new p5.constructor.Vector(camera.eyeX, camera.eyeY, camera.eyeZ);
        const mouse3D = new p5.constructor.Vector(
          p.map(p.mouseX, 0, p.width, -p.width / 2, p.width / 2),
          p.map(p.mouseY, 0, p.height, -p.height / 2, p.height / 2),
          0
        );
        //console.log(p5)
        //return
        // LookAt-Vektor zur Maus
        const lookAtVector = p5.constructor.Vector.sub(mouse3D, camPos).normalize();

        for (let i = 0; i < points.length; i++) {
          // Vektor vom Kameraursprung zum Punkt
          const pVectpr = new p5.constructor.Vector(points[i][0],points[i][1],points[i][2])
          const pointVector = p5.constructor.Vector.sub(pVectpr, camPos);

          // Projektion des Punktvektors auf den LookAt-Vektor
          const projectionLength = pointVector.dot(lookAtVector);
          const projection = p5.constructor.Vector.mult(lookAtVector, projectionLength);

          // Abstand zwischen dem Punkt und der Projektion auf dem LookAt-Vektor
          const distanceToLine = p5.constructor.Vector.sub(pointVector, projection).mag();

          // Nächstgelegenen Punkt finden
          if (distanceToLine < minDistance) {
            minDistance = distanceToLine;
            closestIndex = i;
          }
        }
        return closestIndex;
      };

      closestPoint = points[getClosestPointToMouse(p5)];

      if (closestPoint) {
        p5.push();
        p5.fill(255, 0, 0);
        p5.translate(closestPoint[0], closestPoint[1], closestPoint[2]);
        p5.sphere(3);
        p5.pop();
      }



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
  }

  return <NextReactP5Wrapper sketch={sketch} />;
};

export default P5Test;





