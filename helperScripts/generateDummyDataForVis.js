import http from "http";
import fs from "fs";

// Read the JSON files
const projectData = JSON.parse(fs.readFileSync("./projects.json", "utf8"));
const semestersData = JSON.parse(fs.readFileSync("./semesters.json", "utf8"));

// Generate the data
const d = [];
semestersData.forEach(semester => {
    const sh = semester.shortHandle;
    const semesterProjects = projectData.filter(project => project.semester === sh).map(p => ({ name: p.name }));
    d.push({
        "semester": semester.semester,
        "children": semesterProjects
    });
});

// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.url === "/api/data" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(d, null, 2));
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

// Start the server
const PORT = 3010;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});