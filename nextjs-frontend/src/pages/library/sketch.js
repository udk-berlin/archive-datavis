import Planet from "./Planet";
import SolarSystem from "./SolarSystem";
export function sketch  (p5)  {
    let img;

    let centralPoint = { x: 0, y: 0, z: 0 };
    let camera;

    let planets = [];

    let planetData = [];

    let galaxyRotation = false;

    let rotationSpeed = 0.05;

    let rotationAngles = {
      angleX: p5.radians(0),
      angleY: p5.radians(0),
      angleZ: p5.radians(0),
    };

    let solarSystem;

    let font;


    let windowWidth = 700

    let updateFocusedId = () => {};

    p5.updateWithProps = (props) => {
      if (props.focusedId) {
        console.log("fId", props.focusedId);
      }

      if (props.windowWidth) {
        windowWidth = props.windowWidth;
      }

      if(props.setFocusedId){
        updateFocusedId = props.setFocusedId
      }
      // if(props.sFId){
      //   console.log('setFId',props.sFId)
      //   updateFocusedId = props.sFId
      // }
    };

    p5.preload = async () => {
      img = p5.loadImage("/images/floatingShadow.png");

      font = p5.loadFont("/fonts/inter/Inter-Regular.otf");

      // Fetch data for the second planet
      planetData = await fetchData("http://localhost:3010/api/all");

      //planetData = await fetchData("http://192.168.1.101:3010/api/all");
    };

    p5.setup = async () => {
      const parent = document.querySelector("main");
      p5.createCanvas((windowWidth * 5) / 7, parent.offsetHeight, p5.WEBGL);
      // addScreenPositionFunction(p5);

      centralPoint = p5.createVector(0, 0, 0);

      solarSystem = new SolarSystem(p5);

      await new Promise((r) => setTimeout(r, 100));


      console.log("a", planetData);

      solarSystem.addPlanet(
        new Planet(p5, {
          mode: "displacement",
          distance: planetData.authors.length,
          //centralPoint: p5.createVector(0, -100, 300),
          centralPoint: p5.createVector(-1000, 0, 0),
          data: planetData.authors,
          id: "authors",
        })
      );

      solarSystem.addPlanet(
        new Planet(p5, {
          mode: "displacement",
          distance: planetData.semesters.length,
          //centralPoint: p5.createVector(0, -100, 300),
          centralPoint: p5.createVector(500, 500, 0),
          data: planetData.semesters,
          id: "semesters",
        })
      );


      solarSystem.addPlanet(
        new Planet(p5, {
          mode: "displacement",
          distance: planetData.entries.length,
          //centralPoint: p5.createVector(0, -100, 300),
          centralPoint: p5.createVector(0, 0, 0),
          data: planetData.entries,
          rotationSpeed: 0.01,
          id: "entries",
        })
      );


      camera = p5.createCamera();


      const ids = solarSystem.devGetAllIds();

      solarSystem.addConnection(["deb2f2ea-8003-4962-8130-9324ba8d55b5", "a9074c12-ed0d-42a4-886e-45bd81d4749e"]);
      solarSystem.addEllipse({ id: "deb2f2ea-8003-4962-8130-9324ba8d55b5" }, { id: "a9074c12-ed0d-42a4-886e-45bd81d4749e" });
      solarSystem.addEllipse({ id: "deb2f2ea-8003-4962-8130-9324ba8d55b5" }, { id: "0a03c9c6-5a44-4f97-a4a3-ae6e59c3ebdb" });
      solarSystem.addEllipse({ id: "deb2f2ea-8003-4962-8130-9324ba8d55b5" }, { id: "0dc9706f-fc15-493a-b83b-2d9e58017c9e" });
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

      //  solarSystem.drawConnections();
      solarSystem.drawEllipses();
      if (galaxyRotation) p5.pop();
    };

    p5.mouseClicked = () => {
      //solarSystem.setSingleIdActive()
      const newFocusedId = solarSystem.setClickedIdActive(planetData.entries);
      if(newFocusedId ) updateFocusedId(newFocusedId);
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
  };