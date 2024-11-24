class SolarSystem {
  constructor(p5) {
    this.planets = [];
    this.connections = [];
    this.ellipses = [];
    this.p5 = p5;
    this.activeId = null;
  }

  drawConnections() {
    this.connections.forEach((connection) => {
      this.p5.stroke(0, 250, 0);
      this.p5.beginShape();
      connection.forEach((point) => {
        this.p5.vertex(point.x, point.y, point.z);
      });
      this.p5.endShape(this.p5.CLOSE);
    });
  }

  drawEllipses() {
    this.ellipses.forEach((e) => {
      const sourcePoint = this.getPlanet(e.source.planetId).getPointById(e.source.id.id);
      const targetPoint =  this.getPlanet(e.target.planetId).getPointById(typeof(e.target.id) === 'object' ? e.target.id.id : e.target.id);
    // if(sourcePoint && targetPoint) this.drawEllipseBetweenPoints(sourcePoint, targetPoint);
      if(sourcePoint && targetPoint) this.drawCurveBetweenPoints(sourcePoint, targetPoint);
      //this.drawEllipseBetweenPoints(e.source.point, e.target.point);
    });
  }

  drawEllipseBetweenPoints(p1, p2) {
    let midpoint = this.p5.constructor.Vector.add(p1, p2).mult(0.5);
    let direction = this.p5.constructor.Vector.sub(p2, p1);
    let dist = direction.mag();
  
    let dir = direction.copy().normalize();
  
   
    let originalVector = this.p5.createVector(1, 0, 0);
  
   
    let angle = Math.acos(dir.dot(originalVector));
    let axis = this.p5.constructor.Vector.cross(originalVector, dir);
  
   
    if (axis.mag() < 0.0001 || isNaN(angle)) {
      axis = this.p5.constructor.createVector(0, 0, 1);
      angle = 0;
    } else {
      axis.normalize();
    }
  
    this.p5.push();
    this.p5.translate(midpoint.x, midpoint.y, midpoint.z);
    this.p5.rotate(angle, axis);
    this.p5.noFill();
    this.p5.stroke(255, 0, 255);
    this.p5.ellipse(0, 0, dist, dist,[50]);
    this.p5.pop();
  }

  drawCurveBetweenPoints(p1, p2) {
    // Calculate the midpoint between p1 and p2
    let midpoint = this.p5.constructor.Vector.add(p1, p2).mult(0.5);
  
    // Calculate the direction vector from p1 to p2
    let direction = this.p5.constructor.Vector.sub(p2, p1).normalize();
  
    // Define the up vector
    let up = this.p5.createVector(0, 1, 0);
  
    // Project the up vector onto the plane perpendicular to the direction vector
    let projection = this.p5.constructor.Vector.mult(direction, direction.dot(up));
    let offset = this.p5.constructor.Vector.sub(up, projection).normalize();
  
    // Determine the amount to offset the control point
    let amount = 100; // Increase this value to make the arc more pronounced
  
    // Calculate the control point by offsetting the midpoint
    let controlPoint = midpoint.copy().add(offset.mult(amount));
  
    // Draw the curve
    this.p5.push();
    this.p5.noFill();
    this.p5.stroke(255, 0, 255);
    this.p5.beginShape();
    this.p5.vertex(p1.x, p1.y, p1.z);
    this.p5.quadraticVertex(
      controlPoint.x,
      controlPoint.y,
      controlPoint.z,
      p2.x,
      p2.y,
      p2.z
    );
    this.p5.endShape();
    this.p5.pop();
  }

  draw() {
    this.planets.forEach((planet) => planet.draw());

    //this.drawConnections();
    this.drawEllipses();
  }

  async addPlanet(planet, dataUrl) {
    if (dataUrl) {
      try {
        const response = await fetch(dataUrl);
        if (response.ok) {
          const data = await response.json();
          planet.data = data;
        } else {
          console.error("Failed to fetch planet data");
        }
      } catch (error) {
        console.error("Error fetching planet data:", error);
      }
    }
    this.planets.push(planet);
  }

  getPlanets() {
    return this.planets;
  }

  getPlanet(id) {
    return this.planets.find((p) => p.id === id);
  }

  removePlanet(planet) {
    this.planets = this.planets.filter((p) => p !== planet);
  }

  removePlanetById(id) {
    this.planets = this.planets.filter((p) => p.id !== id);
  }

  clearPlanets() {
    this.planets = [];
  }

  devGetAllIds() {
    return this.planets.map((p) => p.devGetAllIds());
  }

  getHoverIds() {
    const hIds = [];
    this.planets.forEach((p, i) => {
      const hId = p.getHoverId();
      if (hId) hIds.push({ planetId: this.planets[i].getId(), id: hId });
    });

    return hIds;
  }

  getPointAndPlanetIdById(id) {
    let found;

    this.planets.forEach((p) => {
      if (!found) {
        const pId = p.getPointById(id);
        if (pId) found = { planetId: p.getId(), id: pId, point: pId.id, point: pId };
      }
    });
    return found;
  }

  setIdsOfPlanetActive(planetId, activeIds) {
    activeIds.forEach((aId, i) => {
      this.getPlanet(planetId).setIdActive(aId);
    });
  }

  setSingleIdActive() {
    const hIds = this.getHoverIds();
    if (hIds && hIds.length > 0) {
      this.deactivateAllActiveIds();
      console.log(hIds[0].id)
      this.setIdsOfPlanetActive(hIds[0].planetId, [hIds[0].id]);
    }
    return hIds[0]?.id
  }

  setConnectionsForId(id,data) {

    this.ellipses = [];


    data.authors.forEach((authorId) => {
      this.addEllipse({id:id}, {id:authorId});
    });
    data.semester.forEach((semesterId) => {
      this.addEllipse({id:id}, {id:semesterId});
    } );


  }

  setClickedIdActive(data) {
    const id = this.setSingleIdActive()
    this.activeId = id;

    if (id) {
      this.setConnectionsForId(id,data.find((entry) => entry.id === id));
    }
    return id
  }


  deactivateAllActiveIds() {
    this.planets.forEach((p) => {
      p.setActiveIds([]);
    });
  }

  addEllipse(source, target) {
    let sourcePoint;
    let targetPoint;

    if (source.planetId) {
      sourcePoint = this.getPlanet(source.planetId).getPointById(source.id);
    } else {
      sourcePoint = this.getPointAndPlanetIdById(source.id);
    }
    if (target.planetId) {
      targetPoint = {planetId: target.planetId, id: target.id, point:  this.getPlanet(target.planetId).getPointById(target.id)} ;
    } else {
      targetPoint = this.getPointAndPlanetIdById(target.id);
    }

    if (sourcePoint && targetPoint) {
      this.ellipses.push({ source: sourcePoint, target: targetPoint });
    }

    console.log(sourcePoint, targetPoint);
    this.getPlanet(sourcePoint.planetId).setIdActive(sourcePoint.id.id);
    this.getPlanet(targetPoint.planetId).setIdActive(targetPoint.id.id);
  }

  addConnection(connection) {
    const points = connection.map((id) => {
      let found;
      this.planets.forEach((planet) => {
        if (!found) {
          found = planet.getPointById(id);
        }
      });
      return found;
    });
    this.connections.push(points);
  }
}

export default SolarSystem;
