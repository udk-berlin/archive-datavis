class SolarSystem {
  constructor() {
    this.planets = [];
    this.connections = []
  }

  draw() {
    this.planets.forEach((planet) => planet.draw());
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
}

export default SolarSystem;
