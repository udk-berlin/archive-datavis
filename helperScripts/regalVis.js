import fs from "fs";

const data = JSON.parse(fs.readFileSync("./matrixEntries.json", "utf8"));

const cells = [];

data.forEach((entry) => {
  const cell = cells.find((c) => c.row === entry.archive.row && c.column === entry.archive.column);

  if (!cell) {
    cells.push({
      row: entry.archive.row,
      column: entry.archive.column,
      entries: [entry],
    });
  } else {
    cell.entries.push(entry);
  }
});



cells.forEach((cell) => {
  
    console.log(cell.column, cell.row, cell.entries.length);
    
})
