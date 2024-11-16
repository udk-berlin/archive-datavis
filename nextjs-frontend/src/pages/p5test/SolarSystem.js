class SolarSystem {
  constructor(p5) {
    this.planets = [];
    this.connections = [];
    this.p5 = p5;
  }

  drawConnections() {
    this.connections.forEach((connection) => {
        console.log('asdasd')
        this.p5.stroke(0, 250, 0);
        this.p5.beginShape();
        connection.forEach((point) => {
            this.p5.vertex(point.x, point.y, point.z);
        });
        this.p5.endShape(this.p5.CLOSE);
    });
  }

  draw() {
    this.planets.forEach((planet) => planet.draw());

    this.drawConnections();
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



  addConnection(connection) {
    const points = connection.map((id) => {
        let found
        this.planets.forEach((planet) => {
            if(!found ) {
                found = planet.getPointById(id);
            }
        });
        return found;
    });
    this.connections.push(points);
  }
}

export default SolarSystem;
