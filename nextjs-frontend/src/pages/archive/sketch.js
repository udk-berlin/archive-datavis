import { Scale } from "lucide-react";
import Planet from "./Planet";
import SolarSystem from "./SolarSystem";

import easingFunctions from "@/lib/easingFunctions";

import { v4 as uuidv4 } from "uuid";


class HUD {
  constructor(p5) {
    this.p5 = p5;
    this.labels = []
  }

  drawLabel(point, {side, text, fill, stroke}) {
    this.p5.push()
    this.p5.translate(point?.x, point?.y, point?.z);
    this.p5.rectMode(this.p5.CORNER);
    this.p5.ellipseMode(this.p5.CENTER);

    this.p5.noFill();  
    this.p5.stroke(0);
    this.p5.strokeWeight(3);
    this.p5.ellipse(0, 0, 50, 50);

    if(side === 'left') {
      this.p5.line(-25,0,-150,0);
      // this.p5.fill(236, 239, 241)
      this.p5.rect(-150, -25, -1*text?.length*22, 50);
      this.p5.fill(0);
      this.p5.textAlign(this.p5.RIGHT, this.p5.CENTER);
      this.p5.textSize(32);
      this.p5.text(text, -175, -7);
    }

    this.p5.pop();
  }

  addLabel(point, text,type) {
    this.labels.push({point, text, type});
  }

  draw(point, side) {


    this.p5.push();


    this.p5.translate(point?.x, point?.y, point?.z);


    const cam = this.p5._renderer._curCamera;
    let camPosition = this.p5.createVector(cam.eyeX, cam.eyeY, cam.eyeZ);


    let dir = this.p5.createVector(
      camPosition.x - point?.x,
      camPosition.y - point?.y,
      camPosition.z - point?.z
    );


    let theta = Math.atan2(dir.x, dir.z);
    let phi = Math.atan2(dir.y, Math.sqrt(dir.x * dir.x + dir.z * dir.z));


    this.p5.rotateY(theta);
    this.p5.rotateX(-phi);

    this.labels.forEach(label => {
      this.drawLabel(label.point, {side: "left", text: label.text, stroke: "black"});
    })


    this.p5.pop();

  }
}

export function sketch(p5) {

  p5.constructor.prototype.screenPosition = function(x, y, z) {
    const p = p5.createVector(x, y, z);
    const cam = p5._renderer._curCamera;
  
    // Model-View-Projection matrix
    const mvp = p5._renderer.uMVMatrix
      .copy()
      .mult(p5._renderer.uPMatrix);
  
    // Transform the point
    const coords = p4MultMatrix(p, mvp);
  
    // Normalize
    const norm = coords.copy().div(coords.w);
  
    // Map to screen coordinates
    norm.x = this.map(norm.x, -1, 1, 0, this.width);
    norm.y = this.map(-norm.y, -1, 1, 0, this.height);
  
    return norm;
  };
  
  function p4MultMatrix(p, m) {
    const result = p5.createVector();
    result.x =
      p.x * m.mat4[0] + p.y * m.mat4[4] + p.z * m.mat4[8] + m.mat4[12];
    result.y =
      p.x * m.mat4[1] + p.y * m.mat4[5] + p.z * m.mat4[9] + m.mat4[13];
    result.z =
      p.x * m.mat4[2] + p.y * m.mat4[6] + p.z * m.mat4[10] + m.mat4[14];
    result.w =
      p.x * m.mat4[3] + p.y * m.mat4[7] + p.z * m.mat4[11] + m.mat4[15];
    return result;
  }


  let img;

  let hud;

  let centralPoint = { x: 0, y: 0, z: 0 };

  let planets = [];

  let planetData = [];

  let autoRotation;

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

  let setAutoRotation = () => {};

  let updateFocusedIds = () => {};
  let updateFocusedType = () => {};

  p5.updateWithProps = (props) => {
    if (props.windowWidth) {
      windowWidth = props.windowWidth;
    }
    if (props.setFocusedIds) {
      updateFocusedIds = props.setFocusedIds;
    }
    if (props.setFocusedType) {
      updateFocusedType = props.setFocusedType;
    }
    if (props.setAutoRotation) {
      setAutoRotation = props.setAutoRotation;
    }
    if (props.autoRotation) {
      autoRotation = props.autoRotation === "on" ? true : false;
    }
  };

  p5.preload = async () => {
    img = p5.loadImage("/images/floatingShadow.png");
    font = p5.loadFont("/fonts/inter/Inter-Regular.otf");
    planetData = await fetchData("http://localhost:3010/api/all");
  };

  p5.setup = async () => {
    const parent = document.getElementById("sketch-container");
    p5.createCanvas(parent.offsetWidth, parent.offsetHeight, p5.WEBGL);


    hud = new HUD(p5);

    const scale = 1.5;
    const defaultScale = 1.5;

    cam = p5.createCamera();
    cam.ortho(-p5.width / scale, p5.width / scale, -p5.height / scale, p5.height / scale, -20, 3000);

    cameraStartView = iniStartCamera(p5.createCamera(), scale);
    cameraDefaultView = iniDefaultCamera(p5.createCamera(), scale, defaultScale);

    solarSystem = new SolarSystem(p5);

    await new Promise((r) => setTimeout(r, 100));

    solarSystem.addPlanet(
      new Planet(p5, {
        mode: "ring",
        distance: planetData.authors.length*4,
        centralPoint: p5.createVector(0, 0, 0),
        rotationAngles: { angleX: 90, angleY: 0, angleZ: 0 },
        data: planetData.authors,
      //  distance: 750,
        id: "authors",
      })
    );

    solarSystem.addPlanet(
      new Planet(p5, {
        mode: "ring",
        distance: planetData.semesters.length*4,
        centralPoint: p5.createVector(0, -500, 0),
        rotationAngles: { angleX: 90, angleY: 0, angleZ: 0 },
       // distance: 500,
        data: planetData.semesters,
        id: "semesters",
      })
    );

    solarSystem.addPlanet(
      new Planet(p5, {
        mode: "ring",
        distance: planetData.semesters.length*4,
        centralPoint: p5.createVector(0, 500, 0),
        rotationAngles: { angleX: 90, angleY: 0, angleZ: 0 },
       // distance: 500,
        data: planetData.semesters,
        id: "semesters",
      })
    );

    const dummy = [];

    for (let i = 0; i < 1000; i++) {
      dummy.push({
        id: uuidv4(),
        name: "",
        authors: [],
        semester: [],
        children: [],
      });
    }

    solarSystem.addPlanet(
      new Planet(p5, {
        mode: "plane",
        distance: planetData.entries.length,
        centralPoint: p5.createVector(0, 0, 0),
        data: planetData.entries.concat(dummy),
        distance: 20,
        rotationSpeed: 0.01,
        id: "entries",
        drawHull: false,
        planeColumns: 14,
      })
    );
    p5.textFont(font);
    p5.textSize(32);
    p5.textAlign(p5.CENTER, p5.CENTER);



    hud.addLabel(centralPoint, "Projects", "left");
    hud.addLabel(p5.createVector(-1*planetData.authors.length*4,0, 0), "Persons", "left");
    hud.addLabel(p5.createVector(-1*planetData.semesters.length*4,-500, 0), "Semesters", "left");
    hud.addLabel(p5.createVector(-1*planetData.semesters.length*4,500, 0), "Archive", "left");

  };

  function updateRotation() {
    rotationAngles.angleX += p5.radians(rotationSpeed);
    rotationAngles.angleY -= p5.radians(rotationSpeed);
    rotationAngles.angleZ += p5.radians(rotationSpeed);
  }

  p5.draw = () => {
    if (!introAnimationFinished) {
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
      p5.orbitControl(-1, -1, 0.25);
    }

    p5.background(236, 239, 241);

    //p5.ambientLight(150);
   // p5.directionalLight(255, 255, 255, 1, 1, -1);

    if (autoRotation && p5.millis() > 2000) {
      updateRotation();
      p5.push();
      p5.translate(0, 0, 0);
      p5.rotateY(rotationAngles.angleY);
      p5.translate(-centralPoint.x, -centralPoint.y, -centralPoint.z);
    }

    solarSystem.draw();


    if (autoRotation && p5.millis() > 2000) p5.pop();

    const point = solarSystem.getPointAndPlanetIdById("5add7d1a-ecc7-4c24-9cc4-2f992f13644c")

    hud.draw(centralPoint);


  };

  

  p5.mouseClicked = () => {
    //solarSystem.setSingleIdActive()
    if (p5.mouseX > p5.width - 100 && p5.mouseX < p5.width && p5.mouseY > p5.height - 100 && p5.mouseY < p5.height) {
      // we will not procced as the click is a z-index above the canvas
      return;
    }
    // setAutoRotation(false);
    introAnimationFinished = true;
    const { id: newFocusedId, planetId, focusedKeys } = solarSystem.setClickedIdActive(planetData);
    if (planetId === "entries" && newFocusedId) {
      updateFocusedType({ type: "entries", id: newFocusedId });
      updateFocusedIds([newFocusedId]);
    } else if (planetId === "authors" && newFocusedId) {
      updateFocusedType({ type: "authors", id: newFocusedId });
      if (focusedKeys?.entries?.length > 0) updateFocusedIds(focusedKeys.entries);
    } else if (planetId === "semesters" && newFocusedId) {
      updateFocusedType({ type: "semesters", id: newFocusedId });
      if (focusedKeys?.entries?.length > 0) updateFocusedIds(focusedKeys.entries);
    }
    console.log("reset", newFocusedId);
    if (!planetId && !newFocusedId) {
      updateFocusedType({ type: null, id: null });
      updateFocusedIds([]);
      solarSystem.clearFocus();
    }
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

  function iniDefaultCamera(camera, scale, defaultScale) {
    camera = p5.createCamera();
    camera.ortho(
      (-p5.width / scale) * defaultScale,
      (p5.width / scale) * defaultScale,
      (-p5.height / scale) * defaultScale,
      (p5.height / scale) * defaultScale,
      0.1,
      3000
    );
    camera.setPosition(925, 1350, 1040);
    camera.lookAt(0, 0, 0);
    return camera;
  }

  function iniStartCamera(camera, scale) {
    camera = p5.createCamera();
    camera.ortho(-p5.width / scale, p5.width / scale, -p5.height / scale, p5.height / scale, -2000, 8000);
    camera.setPosition(0.000006, 3000, 0.0003);
    camera.lookAt(0, 0, 0);
    return camera;
  }
}
