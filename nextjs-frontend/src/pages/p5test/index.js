import dynamic from "next/dynamic";

import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import { useState, useEffect } from "react";

import { NextReactP5Wrapper } from "@p5-wrapper/next";

import Planet from "./Planet";
import SolarSystem from "./SolarSystem";

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

    let solarSystem

    p5.preload = async () => {
      img = p5.loadImage("/images/floatingShadow.png");

      // Fetch data for the second planet
      planetData = await fetchData("http://localhost:3010/api/data");
    };

    p5.setup = () => {
      p5.createCanvas(windowWidth, 950, p5.WEBGL);
      // addScreenPositionFunction(p5);

      centralPoint = p5.createVector(0, 0, 0);


      solarSystem = new SolarSystem(p5);

      solarSystem.addPlanet(
        new Planet(p5, {
          mode: "ring",
          distance: 100,
          centralPoint: p5.createVector(0, 0, 0),
          data: planetData,
          rotationAngles: { angleX: 45, angleY: 0, angleZ: 0 },
          orbitRadii: { rx: 200, ry: 100 },
        })
      );

      solarSystem.addPlanet(
        new Planet(p5, {
          mode: "displacement",
          distance: 100,
          centralPoint: p5.createVector(-400, 0, 0),
          data: planetData,
        })
      );

      solarSystem.addPlanet(
        new Planet(p5, {
          mode: "line",
          distance: 100,
          centralPoint: p5.createVector(400, 0, 0),
          data: planetData,
          camera: camera,
        })
      );

      camera = p5.createCamera();




      const ids = solarSystem.devGetAllIds();

      solarSystem.addConnection([ids[2][15], ids[1][10]]);
    };

    p5.draw = () => {
      p5.background(236, 239, 241);

      p5.orbitControl();
      p5.ambientLight(150);
      p5.directionalLight(255, 255, 255, 1, 1, -1);

      solarSystem.getPlanets().forEach((planet) => {
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

      solarSystem.drawConnections();
    };

    async function fetchData(url) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const d = await response.json();
          if (d) {
            return d;
          } else {
            return [];
          }
        } else {
          console.error("Failed to fetch planet data");
          return [];
        }
      } catch (error) {
        console.error("Error fetching planet data:", error);
        return [];
      }
    }
  }

  return <NextReactP5Wrapper sketch={sketch} />;
};

export default P5Test;
