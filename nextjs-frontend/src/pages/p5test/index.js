import dynamic from "next/dynamic";

import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import { addScreenPositionFunction } from "./screenPosition";
import { useState } from "react";

import { NextReactP5Wrapper } from "@p5-wrapper/next";

import Orbit from "./Orbit";

const P5Test = () => {
  let papertexture;

  // const [img, setImg] = useState();

  function sketch(p5) {
    let img;
    let displacedPoints = [];
    let points = [];
    let centralPoint = { x: 0, y: 0, z: 0 };
    let camera;


    let testOrbit 

    p5.preload = () => {
      console.log("asd");
      img = p5.loadImage("/images/floatingShadow.png");
    };

    p5.setup = () => {
      p5.createCanvas(750, 950, p5.WEBGL);
      addScreenPositionFunction(p5);

      centralPoint = p5.createVector(0, 0, 0);

      testOrbit =  new Orbit(p5, {
        distance: 100,
        centralPoint,
        data: [
          1, 14, 4, 8, 3, 9, 9, 12, 7, 11, 5, 5, 13, 11, 4, 10, 16, 9, 18, 7, 7, 9, 11, 3, 8, 5, 9, 6, 12, 10, 7, 14, 2, 9, 4, 2, 6, 6, 3,
          3, 11, 5, 7, 6, 5, 6, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 57,
        ],
      });

      points = testOrbit.getPoints();
      displacedPoints = testOrbit.getDisplacedPoints();

      camera = p5.createCamera();
    };

    

    p5.draw = () => {
      p5.background(236, 239, 241);

      p5.orbitControl();
      p5.ambientLight(150);
      p5.directionalLight(255, 255, 255, 1, 1, -1);

     //---------

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

        const camPos = new p5.constructor.Vector(camera.eyeX, camera.eyeY, camera.eyeZ);
        const mouse3D = new p5.constructor.Vector(
          p.map(p.mouseX, 0, p.width, -p.width / 2, p.width / 2),
          p.map(p.mouseY, 0, p.height, -p.height / 2, p.height / 2),
          0
        );

        const lookAtVector = p5.constructor.Vector.sub(mouse3D, camPos).normalize();

        for (let i = 0; i < points.length; i++) {
          const pVectpr = new p5.constructor.Vector(points[i][0], points[i][1], points[i][2]);
          const pointVector = p5.constructor.Vector.sub(pVectpr, camPos);
          const projectionLength = pointVector.dot(lookAtVector);
          const projection = p5.constructor.Vector.mult(lookAtVector, projectionLength);
          const distanceToLine = p5.constructor.Vector.sub(pointVector, projection).mag();
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


      testOrbit.draw();


    };
  }

  return <NextReactP5Wrapper sketch={sketch} />;
};

export default P5Test;
