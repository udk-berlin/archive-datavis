import dynamic from "next/dynamic";

import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import { addScreenPositionFunction } from "./screenPosition";
import { useState, useEffect } from "react";

import { NextReactP5Wrapper } from "@p5-wrapper/next";

import Planet from "./Planet";

const P5Test = () => {
  let papertexture;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // const [img, setImg] = useState();

  function sketch(p5) {
    let img;

    let centralPoint = { x: 0, y: 0, z: 0 };
    let camera;

    let planets = [];

    let planetData = [];

    p5.preload = async () => {
      img = p5.loadImage("/images/floatingShadow.png");

      // Fetch data for the second planet
      try {
        const response = await fetch("http://localhost:3010/api/data");
        if (response.ok) {
          planetData = await response.json();
        } else {
          console.error("Failed to fetch planet data");
        }
      } catch (error) {
        console.error("Error fetching planet data:", error);
      }
    };

    p5.setup = () => {
      p5.createCanvas(windowWidth, 950, p5.WEBGL);
      addScreenPositionFunction(p5);

      centralPoint = p5.createVector(0, 0, 0);

      planets.push(
        new Planet(p5, {
          mode: "ring",
          distance: 100,
          centralPoint: p5.createVector(0, 0, 0),
          data: planetData,
          rotationAngles: { angleX: 45, angleY: 0, angleZ: 0 },
          orbitRadii: { rx: 200, ry: 100 }
        }),
      
      );

      planets.push(
        new Planet(p5, {
          mode: "displacement",
          distance: 100,
          centralPoint: p5.createVector(-400, 0, 0),
          data: planetData,
        })
      );

      planets.push(
        new Planet(p5, {
          mode: "line",
          distance: 100,
          centralPoint: p5.createVector(500, 0, 0),
          data: planetData,
        })
      );

      camera = p5.createCamera();
    };

    p5.draw = () => {
      p5.background(236, 239, 241);

      p5.orbitControl();
      p5.ambientLight(150);
      p5.directionalLight(255, 255, 255, 1, 1, -1);

      planets.forEach((planet) => {
        planet.draw();
        if (img) {
          p5.push();
          p5.noStroke();
          p5.noLights();
          p5.translate(planet.getCentralPoint().x, planet.getCentralPoint().y + planet.getDistance() * 2, planet.getCentralPoint().z);
          p5.rotateX(p5.HALF_PI);
          p5.texture(img);
          p5.plane((planet.getDistance() * planet.getAmountOfPoints()) / 20, (planet.getDistance() * planet.getAmountOfPoints()) / 20);
          p5.pop();
        }
      });
    };

    //// tests

    function testMouseHover() {
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
    }
  }

  return <NextReactP5Wrapper sketch={sketch} />;
};

export default P5Test;
