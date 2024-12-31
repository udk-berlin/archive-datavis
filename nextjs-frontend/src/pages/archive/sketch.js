import { Scale } from "lucide-react";
import Planet from "./Planet";
import SolarSystem from "./SolarSystem";

import easingFunctions from "@/lib/easingFunctions";

import { v4 as uuidv4 } from "uuid";

import Hud from "./Hud";

export default function sketch(p5) {
  p5.constructor.prototype.screenPosition = function (x, y, z) {
    const p = p5.createVector(x, y, z);
    const cam = p5._renderer._curCamera;

    const mvp = p5._renderer.uMVMatrix.copy().mult(p5._renderer.uPMatrix);

    const coords = p4MultMatrix(p, mvp);

    const norm = coords.copy().div(coords.w);

    norm.x = this.map(norm.x, -1, 1, 0, this.width);
    norm.y = this.map(-norm.y, -1, 1, 0, this.height);

    return norm;
  };

  function p4MultMatrix(p, m) {
    const result = p5.createVector();
    result.x = p.x * m.mat4[0] + p.y * m.mat4[4] + p.z * m.mat4[8] + m.mat4[12];
    result.y = p.x * m.mat4[1] + p.y * m.mat4[5] + p.z * m.mat4[9] + m.mat4[13];
    result.z = p.x * m.mat4[2] + p.y * m.mat4[6] + p.z * m.mat4[10] + m.mat4[14];
    result.w = p.x * m.mat4[3] + p.y * m.mat4[7] + p.z * m.mat4[11] + m.mat4[15];
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

  let parent;

  let canvasSizeChanged = false;

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
    if (props.canvasSizeChanged) {
      canvasSizeChanged = props.canvasSizeChanged;
      if (windowWidth && parent) {
        p5.resizeCanvas(windowWidth * (canvasSizeChanged / 100), parent.offsetHeight, true);
        p5.redraw();
        p5.clear();
      }
    }
  };

  async function resizeCanvasByParent() {}

  p5.preload = async () => {
    img = p5.loadImage("/images/floatingShadow.png");
    font = p5.loadFont("/fonts/inter/Inter-Regular.otf");
    planetData = await fetchData("http://localhost:3010/api/all");
  };

  p5.windowResized = () => {
    p5.resizeCanvas(parent.offsetWidth, parent.offsetHeight, true);
  };

  p5.setup = async () => {
    parent = document.getElementById("sketch-container");
    p5.createCanvas(parent.offsetWidth, parent.offsetHeight, p5.WEBGL);


    easycam = p5.createEasyCam(p5._renderer, { distance: 1000 });
    easycam.setRotation([0.9, -0.09, 0.3, -0.03]);
    //easycam.setDefaultInterpolationTime(2000);

    easycam.setDistance(900, 3500);
     easycam.setCenter([0, 0, 0]);
 


    const scale = 1.5;
    const defaultScale = 1.5;

    cam = p5.createCamera();
    cam.ortho(-p5.width / scale, p5.width / scale, -p5.height / scale, p5.height / scale, -20, 3000);

    cameraStartView = iniStartCamera(p5.createCamera(), scale);
    cameraDefaultView = iniDefaultCamera(p5.createCamera(), scale, defaultScale);

    solarSystem = new SolarSystem(p5);

    await new Promise((r) => setTimeout(r, 400));


    const entriesDistance = 17
    const entriesColumns = 10

    solarSystem.addPlanet(
      new Planet(p5, {
        mode: "plane",
        distance: planetData.entries.length || 0,
        centralPoint: p5.createVector(0, 0, 0),
        data: planetData.entries,
        distance: entriesDistance,
        rotationSpeed: 0.01,
        id: "entries",
        drawHull: false,
        planeColumns: entriesColumns,
      })
    );



    solarSystem.addPlanet(
      new Planet(p5, {
        mode: "stripe",
        distance: planetData.authors.length * 4 || 0,
        centralPoint: p5.createVector(0, ((planetData.entries.length/entriesColumns)*entriesDistance)/4, 0),
        rotationAngles: { angleX: 90, angleY: 0, angleZ: 0 },
        data: planetData.authors || [],
          distance: 300,
        id: "authors",
        stripeSettings: {
          maxPerRing: 120,
          layerDistance: 10,
          layerRotation: 10,
        },

      })
    );

    solarSystem.addPlanet(
      new Planet(p5, {
        mode: "ring",
        distance: planetData?.semesters?.length * 4 || 0,
        centralPoint: p5.createVector(0, ((planetData.entries.length/entriesColumns)*entriesDistance)/4*-1, 0),
        rotationAngles: { angleX: 90, angleY: 0, angleZ: 0 },
         distance: 300,
        data: planetData?.semesters || [],
        id: "semesters",
      })
    );

    solarSystem.addPlanet(
      new Planet(p5, {
        mode: "stripe",
        distance: planetData?.archive?.length || 0,
        centralPoint: p5.createVector(0, 0, 0),
        rotationAngles: { angleX: 90, angleY: 0, angleZ: 0 },
         distance: 485,
        data: planetData?.archive || [],
        id: "archive",
        stripeSettings: {
          maxPerRing: 120,
          layerDistance: 14,
          layerRotation: 10,
        }
      })
    );


    p5.textFont(font);
    p5.textSize(32);
    p5.textAlign(p5.CENTER, p5.CENTER);

    hud.addLabel({ point: centralPoint, text: "Projects" });
    hud.addLabel({ point: p5.createVector(-1 * planetData.authors.length * 4, 0, 0), text: "Persons" });
    hud.addLabel({ point: p5.createVector(-1 * planetData.semesters.length * 4, -500, 0), text: "Semesters" });
    hud.addLabel({ point: p5.createVector(-1 * planetData.archive.length, 500, 0), text: "Archive" });
  };

  function updateRotation() {
    rotationAngles.angleX += p5.radians(rotationSpeed);
    rotationAngles.angleY -= p5.radians(rotationSpeed);
    rotationAngles.angleZ += p5.radians(rotationSpeed);
  }

  p5.draw = () => {

   // easycam.setRotation([rotationA, rotationB, rotationC, rotationD]);

    var cam_dist = easycam.getDistance();
    var oscale = cam_dist * 0.001;
    var ox = (p5.width / 2) * oscale;
    var oy = (p5.height / 2) * oscale;
    p5.ortho(-ox, +ox, -oy, +oy, -10000, 10000);
      easycam.setPanScale(0.004 / p5.sqrt(cam_dist));

    // if (!introAnimationFinished) {
    //   if (amt < 1) {
    //     if (p5.millis() > 100) {
    //       amt += 0.005;
    //     }
    //     //  cam.slerp(cameraStartView, cameraDefaultView, easingFunctions.easeOutCubic(amt));
    //     //   p5.setCamera(cam);
    //   } else {
    //     //   p5.setCamera(cam);
    //     introAnimationFinished = true;
    //   }
    // } else {
    //   p5.orbitControl(-1, -1, 0.25);
    // }


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

    // plane
    // p5.fill(236, 239, 241)
    // p5.plane(200,1400)

    if (autoRotation && p5.millis() > 2000) p5.pop();

    // const hoverIds = solarSystem.getHoverIds()
    // if(hoverIds && hoverIds.length > 0) {
    //   hud.clearLabels()
    //   const d = solarSystem.getPlanet(hoverIds[0]?.planetId)?.getPointById(hoverIds[0]?.id)
    //   console.log(hoverIds[0], d)
    //   hud.addLabel({point:d,text: "hover", type:"hover"});
    // }

    //    hud.draw(centralPoint);

    

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
    } else if (planetId === "archive" && newFocusedId) {
      updateFocusedType({ type: "archive", id: newFocusedId });
      if (focusedKeys?.archive?.length > 0) updateFocusedIds(focusedKeys.archive);
    }
    // console.log("reset", newFocusedId);
    // if (!planetId && !newFocusedId) {
    //   updateFocusedType({ type: null, id: null });
    //   updateFocusedIds([]);
    //   solarSystem.clearFocus();
    // }
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
    camera.setPosition(0, 1350, 1040);
    camera.lookAt(0, 0, 0);
    return camera;
  }

  function iniStartCamera(camera, scale) {
    camera = p5.createCamera();
    camera.ortho(-p5.width / scale, p5.width / scale, -p5.height / scale, p5.height / scale, -2000, 8000);
    camera.setPosition(0.000006, 3000, 110.0003);
    camera.lookAt(0, 0, 0);
    return camera;
  }
}
