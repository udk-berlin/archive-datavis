import Connections from "./Connections";
class SolarSystem {
  constructor(p5) {
    this.planets = [];

    this.ellipses = [];
    this.p5 = p5;
    this.activeId = null;
    this.connections = new Connections(p5);
  }

  draw() {
    this.planets.forEach((planet) => planet.draw());
    this.connections.draw();
  }

  // drawEllipses() {
  //   this.ellipses.forEach((e) => {
  //     const sourcePoint = this.getPlanet(e.source.planetId).getPointById(e.source.id.id);
  //     const targetPoint = this.getPlanet(e.target.planetId).getPointById(typeof e.target.id === "object" ? e.target.id.id : e.target.id);
  //     // if(sourcePoint && targetPoint) this.drawEllipseBetweenPoints(sourcePoint, targetPoint);
  //     if (sourcePoint && targetPoint) this.drawCurveBetweenPoints(sourcePoint, targetPoint);
  //     //this.drawEllipseBetweenPoints(e.source.point, e.target.point);
  //   });
  // }

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
      this.setIdsOfPlanetActive(hIds[0].planetId, [hIds[0].id]);
    }
    return hIds[0]?.id;
  }

  setConnectionsForId(id, data, type) {
    this.connections.clearConnections();

    switch (type) {
      case "entries":
        data?.authors?.forEach((authorId) => {
          this.addIdsAsConnection({ id: id }, { id: authorId });
        });
        data?.semester?.forEach((semesterId) => {
          this.addIdsAsConnection({ id: id }, { id: semesterId });
        });
        break;
      case "authors":
        data?.entries?.forEach((entryId) => {
          this.addIdsAsConnection({ id: id }, { id: entryId });
        });
        break;
      default:
    }
  }

  clearFocus() {
    this.connections.clearConnections();
    this.deactivateAllActiveIds();
    this.activeId = null;
  }

  setClickedIdActive(d) {
    const id = this.setSingleIdActive();
    this.activeId = id;
    const focusedKeys = {};

    const planetId = this.getPointAndPlanetIdById(id)?.planetId;

    if (!planetId) {
      console.log("No planetId found for id", id);
      return { planetId: null, id: null, focusedKeys };
    }

    if (id) {
      this.setConnectionsForId(
        id,
        d[planetId].find((entry) => entry.id === id),
        planetId
      );
    }

    if (planetId === "authors") {
      focusedKeys.entries = this.getPlanet("entries").getActiveIds();
      if (focusedKeys?.entries.length > 0) {
        focusedKeys.semesters = focusedKeys.entries.map((e) => {
          return d.entries.find((entry) => entry.id === e).semester[0];
        });
        this.getPlanet("semesters").setActiveIds(focusedKeys.semesters);
        focusedKeys.semesters.forEach((s) => {
          this.addIdsAsConnection({ id: id }, { id: s });
        });
      }
    } else if (planetId === "semesters") {
      focusedKeys.entries = d.semesters.find((s) => s.id === id).children;

      this.getPlanet("entries").setActiveIds(focusedKeys.entries);
      focusedKeys.entries.forEach((e) => {
        this.addIdsAsConnection({ id: id }, { id: e });
      });
      const focusedAuthorIds = [];
      focusedKeys.entries.forEach((e) => {
        const authors = d.entries.find((entry) => entry.id === e).authors;
        authors.forEach((a) => {
          focusedAuthorIds.push(a);
          this.addIdsAsConnection({ id: id }, { id: a });
        });
      });
    }
    return { planetId, id, focusedKeys };
  }

  deactivateAllActiveIds() {
    this.planets.forEach((p) => {
      p.setActiveIds([]);
    });
  }

  addConnection(connection) {
    console.warn("addConnection is deprecated, use addIdsAsConnection instead");
    return;
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

  addIdsAsConnection(source, target) {
    let sourcePoint;
    let targetPoint;

    if (source.planetId) {
      sourcePoint = this.getPlanet(source.planetId).getPointById(source.id);
    } else {
      sourcePoint = this.getPointAndPlanetIdById(source.id);
    }
    if (target.planetId) {
      targetPoint = { planetId: target.planetId, id: target.id, point: this.getPlanet(target.planetId).getPointById(target.id) };
    } else {
      targetPoint = this.getPointAndPlanetIdById(target.id);
    }

    if (sourcePoint && sourcePoint.point && targetPoint && targetPoint.point) {
      this.connections.addConnection(sourcePoint.point, targetPoint.point);
    }

    if (sourcePoint?.planetId && sourcePoint?.id?.id) this.getPlanet(sourcePoint.planetId).setIdActive(sourcePoint.id.id);
    if (targetPoint?.planetId && targetPoint?.id?.id) this.getPlanet(targetPoint.planetId).setIdActive(targetPoint.id.id);
  }
}

export default SolarSystem;
