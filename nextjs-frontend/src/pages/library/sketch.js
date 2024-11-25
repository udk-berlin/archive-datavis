import { Scale } from "lucide-react";
import Planet from "./Planet";
import SolarSystem from "./SolarSystem";

import easingFunctions from '@/lib/easingFunctions' 

export function sketch(p5) {
  let img;

  let centralPoint = { x: 0, y: 0, z: 0 };

  let planets = [];

  let planetData = [];

  let galaxyRotation = true;

  let rotationSpeed = 0.05;

  let introAnimationFinished = false;

  let rotationAngles = {
    angleX: p5.radians(0),
    angleY: p5.radians(0),
    angleZ: p5.radians(0),
  };

  let solarSystem;

  let font;

  let cam, cameraStartView, cameraDefaultView;
  let amt = 0;

  let windowWidth = 700;

  let updateFocusedId = () => {};

  p5.updateWithProps = (props) => {
    if (props.focusedId) {
      console.log("fId", props.focusedId);
    }

    if (props.windowWidth) {
      windowWidth = props.windowWidth;
    }

    if (props.setFocusedId) {
      updateFocusedId = props.setFocusedId;
    }

  };

  p5.preload = async () => {
    img = p5.loadImage("/images/floatingShadow.png");

    font = p5.loadFont("/fonts/inter/Inter-Regular.otf");

   
    planetData = await fetchData("http://192.168.1.101:3010/api/all");

  };

  p5.setup = async () => {
    const parent = document.querySelector("main");
    p5.createCanvas((windowWidth * 5) / 7, parent.offsetHeight, p5.WEBGL);


    const scale = 1.5
    const defaultScale = 1.5
  

    cam = p5.createCamera();
    cam.ortho(-p5.width / scale, p5.width /scale, -p5.height / scale, p5.height / scale, -20, 3000);
  
    cameraStartView = p5.createCamera();
    cameraStartView.ortho(-p5.width / scale, p5.width / scale, -p5.height / scale, p5.height / scale, -2000, 8000);
    cameraStartView.setPosition(0.000006, 3000, 0.0003);
    cameraStartView.lookAt(0, 0, 0);
  
    cameraDefaultView = p5.createCamera();
    cameraDefaultView.ortho(-p5.width / scale*defaultScale, p5.width / scale*defaultScale, -p5.height / scale*defaultScale, p5.height / scale*defaultScale, 0.1, 3000);
    cameraDefaultView.setPosition(925, 1350,1040);
    cameraDefaultView.lookAt(0, 0, 0);


    solarSystem = new SolarSystem(p5);

    await new Promise((r) => setTimeout(r, 100));

    solarSystem.addPlanet(
      new Planet(p5, {
        mode: "ring",
        distance: planetData.authors.length,
        centralPoint: p5.createVector(0, 0, 0),
        rotationAngles: { angleX: 90, angleY: 0, angleZ: 0 },
        data: planetData.authors,
        distance: 500,
        id: "authors",
      })
    );

    solarSystem.addPlanet(
      new Planet(p5, {
        mode: "ring",
        distance: planetData.semesters.length,
        centralPoint: p5.createVector(0, -500, 0),
        rotationAngles: { angleX: 90, angleY: 0, angleZ: 0 },
        distance: 500,
        data: planetData.semesters.slice(0, 64),
        id: "semesters",
      })
    );

    solarSystem.addPlanet(
      new Planet(p5, {
        mode: "ring",
        distance: planetData.semesters.length,
        centralPoint: p5.createVector(0, 500, 0),
        rotationAngles: { angleX: 90, angleY: 0, angleZ: 0 },
        distance: 500,
        data: planetData.semesters,
        id: "semesters",
      })
    );

    solarSystem.addPlanet(
      new Planet(p5, {
        mode: "plane",
        distance: planetData.entries.length * 3,
        centralPoint: p5.createVector(0, 0, 0),
        data: planetData.entries.concat(planetData.entries, planetData.entries),
        distance: 20,
        rotationSpeed: 0.01,
        id: "entries",
        drawHull: false,
        planeColumns: 14,
      })
    );



    //  solarSystem.addEllipse({id:"deb2f2ea-8003-4962-8130-9324ba8d55b5" }, { planetId: "semestersB", id: "0a03c9c6-5a44-4f97-a4a3-ae6e59c3ebdb" })

    p5.textFont(font);
    p5.textSize(32);
    p5.textAlign(p5.CENTER, p5.CENTER);
  };

  function updateRotation() {
    rotationAngles.angleX += p5.radians(rotationSpeed);
    rotationAngles.angleY -= p5.radians(rotationSpeed);
    rotationAngles.angleZ += p5.radians(rotationSpeed);
  }

  p5.draw = () => {


    if(!introAnimationFinished) {
  
    if (amt < 1) {
      if (p5.millis() > 100) {
      amt += 0.005; 
      }
      cam.slerp(cameraStartView, cameraDefaultView, easingFunctions.easeOutCubic(amt));
      p5.setCamera(cam);
    } else {
      p5.setCamera(cam);
      introAnimationFinished = true;
    } 
  } else {
    p5.orbitControl(1, 1, 1);
  }

   


    p5.background(236, 239, 241);

    p5.ambientLight(150);
    p5.directionalLight(255, 255, 255, 1, 1, -1);

    if (galaxyRotation && p5.millis() > 2000) {
      updateRotation();
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

    //  solarSystem.drawConnections();
    solarSystem.drawEllipses();
    if (galaxyRotation && p5.millis() > 2000) p5.pop();
  };

  p5.mouseClicked = () => {
    //solarSystem.setSingleIdActive()
    galaxyRotation = false
    introAnimationFinished = true;
    const newFocusedId = solarSystem.setClickedIdActive(planetData.entries);
    if (newFocusedId) updateFocusedId(newFocusedId);
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
