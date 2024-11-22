import dynamic from "next/dynamic";

import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

import { useState, useEffect } from "react";

import { NextReactP5Wrapper } from "@p5-wrapper/next";

import Planet from "./Planet";
import SolarSystem from "./SolarSystem";
import { Input } from "@/components/ui/input";

import { RiSearchLine } from "@remixicon/react";

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

    let galaxyRotation = true;

    let rotationSpeed = 0.05;

    let rotationAngles = {
      angleX: p5.radians(0),
      angleY: p5.radians(0),
      angleZ: p5.radians(0),
    };

    let solarSystem;

    p5.preload = async () => {
      img = p5.loadImage("/images/floatingShadow.png");

      // Fetch data for the second planet
      // planetData = await fetchData("http://localhost:3010/api/data");

      planetData = await fetchData("http://192.168.1.101:3010/api/all");
    };

    p5.setup = () => {

      const parent = document.querySelector('main')
      p5.createCanvas((windowWidth * 5) / 7, parent.offsetHeight, p5.WEBGL);
      // addScreenPositionFunction(p5);

      centralPoint = p5.createVector(0, 0, 0);

      solarSystem = new SolarSystem(p5);

      // solarSystem.addPlanet(
      //   new Planet(p5, {
      //     mode: "ring",
      //     distance: 100,
      //     centralPoint: p5.createVector(-400, 0, 0),
      //     data: planetData,
      //     rotationAngles: { angleX: 45, angleY: 0, angleZ: 0 },
      //     orbitRadii: { rx: 200, ry: 100 },
      //   })
      // );

      console.log("a", planetData);

      solarSystem.addPlanet(
        new Planet(p5, {
          mode: "displacement",
          distance: planetData.authors.length * 2,
          //centralPoint: p5.createVector(0, -100, 300),
          centralPoint: p5.createVector(-1000, 0, 0),
          data: planetData.authors,
        })
      );

      solarSystem.addPlanet(
        new Planet(p5, {
          mode: "displacement",
          distance: planetData.semesters.length * 2,
          //centralPoint: p5.createVector(0, -100, 300),
          centralPoint: p5.createVector(500, 500, 0),
          data: planetData.semesters,
        })
      );

      solarSystem.addPlanet(
        new Planet(p5, {
          mode: "displacement",
          distance: planetData.semesters.length * 3,
          //centralPoint: p5.createVector(0, -100, 300),
          centralPoint: p5.createVector(0, 0, 800),
          data: planetData.semesters,
        })
      );

      solarSystem.addPlanet(
        new Planet(p5, {
          mode: "displacement",
          distance: planetData.semesters.length * 2,
          //centralPoint: p5.createVector(0, -100, 300),
          centralPoint: p5.createVector(0, 0, -800),
          data: planetData.semesters,
        })
      );

      const dummyData = planetData.authors.flatMap((i) => [i, i, i, i]);
      solarSystem.addPlanet(
        new Planet(p5, {
          mode: "displacement",
          distance: dummyData.length,
          //centralPoint: p5.createVector(0, -100, 300),
          centralPoint: p5.createVector(0, 0, 0),
          data: dummyData,
          rotationSpeed: 0.01,
        })
      );

      // solarSystem.addPlanet(
      //   new Planet(p5, {
      //     mode: "displacement",
      //     distance: 100,
      //     //centralPoint: p5.createVector(0, -100, 300),
      //     centralPoint: p5.createVector(0, 0, 0),
      //     data: planetData,
      //   })
      // );

      // solarSystem.addPlanet(
      //   new Planet(p5, {
      //     mode: "line",
      //     distance: 100,
      //     centralPoint: p5.createVector(400, 0, 0),
      //     data: planetData,
      //     camera: camera,
      //   })
      // );

      camera = p5.createCamera();
      // camera.setPosition(80, 90, 500);

      const ids = solarSystem.devGetAllIds();

      //   solarSystem.addConnection([ids[2][15], ids[1][10]]);
    };

    function updateRotation() {
      rotationAngles.angleX += p5.radians(rotationSpeed);
      rotationAngles.angleY -= p5.radians(rotationSpeed);
      rotationAngles.angleZ += p5.radians(rotationSpeed);
    }

    p5.draw = () => {
      updateRotation();

      p5.background(236, 239, 241);

      p5.orbitControl();
      p5.ambientLight(150);
      p5.directionalLight(255, 255, 255, 1, 1, -1);

      if (galaxyRotation) {
        p5.push();
        p5.translate(0, 0, 0);
        p5.rotateY(rotationAngles.angleY);
        p5.translate(-centralPoint.x, -centralPoint.y, -centralPoint.z);
      }

      solarSystem.getPlanets().forEach((planet) => {
        planet.draw();

        // draw shadow
        // if (img) {
        //   p5.push();
        //   p5.noStroke();
        //   p5.noLights();
        //   p5.translate(planet.getCentralPoint().x, planet.getCentralPoint().y + planet.getDistance() * 2, planet.getCentralPoint().z);
        //   p5.rotateX(p5.HALF_PI);
        //   p5.texture(img);
        //   p5.plane((planet.getDistance() * planet.getAmountOfPoints()) / 20, (planet.getDistance() * planet.getAmountOfPoints()) / 20);
        //   p5.pop();
        // }
      });

      solarSystem.drawConnections();

      p5.pop();
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

  return (
    <div className="flex mr-12">
      <NextReactP5Wrapper sketch={sketch} />
      <div className=" pl-12 flex-grow border-l-[2px] border-white">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <RiSearchLine className="w-5 h-5" />
          </span>
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 h-12 rounded-none "
          />
        </div>
      </div>
    </div>
  );
};

export default P5Test;
