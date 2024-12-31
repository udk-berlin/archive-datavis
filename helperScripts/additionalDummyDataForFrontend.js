import { createClient } from "@supabase/supabase-js";
import express from "express";
import cors from "cors";

// Initialize Supabase client
const supabaseUrl = "http://127.0.0.1:54321";
const supabaseKey =
  "…"; // Replace with your actual Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

let projects = [];
let authors = [];
let semesters = [];
let archive = [];

async function ini() {
  const { data, error } = await supabase.from("entries").select("*");

  if (error) {
    console.error("Error fetching authorType id:", error);
    return null;
  }

  projects = data;

  const { data: data2, error: error2 } = await supabase.from("authors").select("*");

  if (error2) {
    console.error("Error fetching authorType id:", error2);
    return null;
  }

  authors = data2;

  const { data: data3, error: error3 } = await supabase.from("semesters").select("*");

  if (error3) {
    console.error("Error fetching authorType id:", error3);
    return null;
  }
  console.log(data3);

  archive = await fetchAllRows({ tableName: "archive" });

  semesters = data3;

  semesters.forEach((semester) => {
    if (!semester.entries) {
      semester.entries = [];
    }
    semester.entries = semester.entries.map((entry) => {
      return projects.find((p) => p.id === entry);
    });
  });

  authors.forEach((author) => {
    author.entries = [];
    projects.forEach((project) => {
      if (project.authors.includes(author.id)) {
        author.entries.push(project);
      }
    });
  });

  const PORT = 3010;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

const app = express();
app.use(cors());

app.get("/api/all", (req, res) => {
  const ret = {};
  ret.semesters = semesters.map((semester) => {
    return {
      id: semester.id,
      name: semester.name,
      children: semester.entries.map((e) => e.id),
    };
  });
  ret.authors = authors.map((author) => {
    return {
      id: author.id,
      name: author.name,
      children: [],
      entries: projects.map((project) => (project.authors.includes(author.id) ? project.id : null)).filter((e) => e),
    };
  });

  ret.entries = projects.map((project) => {
    return {
      id: project.id,
      name: project.name,
      authors: project.authors,
      semester: project.semester,
      files: project.files,
      children: [],
    };
  });
  ret.archive = archive.map((e) => {
    return { name: e.name, id: e.id };
  });
  res.json(ret);
});

app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.get("/api/archive", (req, res) => {
  res.json(archive);
});

app.get("/api/archive/:id", (req, res) => {
  const ret = archive.find((a) => a.id === req.params.id);
  res.json(ret);
});

app.get("/api/authors", (req, res) => {
  const ret = authors.map((author) => ({
    name: author.name,
    children: author.entries.map((e) => e.name),
  }));
  res.json(ret);
});

app.get("/api/authors/:id", (req, res) => {
  const ret = authors.find((author) => author.id === req.params.id);
  res.json(ret);
});

app.get("/api/semesters", (req, res) => {
  const ret = semesters.map((semester) => ({
    name: semester.name,
    children: semester.entries.map((e) => e.name),
  }));
  res.json(ret);
});

app.get("/api/semesters/:id", (req, res) => {
  const ret = semesters.find((semester) => semester.id === req.params.id);
  res.json(ret);
});

app.get("/api/id/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("entries").select("*").eq("id", id).single();

  if (error) {
    res.status(500).json({ error: "Error fetching data" });
  } else {
    res.json(data);
  }
});

app.get("/api/author/:id", async (req, res) => {
  const { id } = req.params;
  const { data: authorData, error: authorError } = await supabase.from("authors").select("*").eq("id", id).single();

  if (authorError) {
    res.status(500).json({ error: "Error fetching author data" });
  } else {
    const { data: entriesData, error: entriesError } = await supabase
      .from("entries")
      .select("*")
      .eq("authors", JSON.stringify([id]));

    if (entriesError) {
      res.status(500).json({ error: entriesError });
    } else {
      authorData.entries = entriesData;
      res.json(authorData);
    }
  }
});

app.get("/api/project/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("entries").select("*").eq("id", id).single();

  if (error) {
    res.status(500).json({ error: "Error fetching data" });
  } else {
    if (data) {
      data.authors = data.authors.map((authorId) => {
        const author = authors.find((a) => a.id === authorId);
        return author;
      });

      data.semester = data.semester.map((semesterId) => {
        const semester = semesters.find((s) => s.id === semesterId);
        return semester;
      });
    }
    res.json(data);
  }
});

app.get("/api/filemetadata/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }
  const data = await getFileMetaDataById(id);
  if (data.error) {
    res.status(500).json({ error: "Error fetching file metadata" });
  } else {
    res.json(data);
  }
});

async function getAuthorById(id) {
  const { data: authorData, error: authorError } = await supabase.from("authors").select("*").eq("id", id).single();

  if (authorError) {
    return { error: "Error fetching author data" };
  } else {
    const { data: entriesData, error: entriesError } = await supabase
      .from("entries")
      .select("*")
      .eq("authors", JSON.stringify([id]));

    if (entriesError) {
      return { error: entriesError };
    } else {
      authorData.entries = entriesData;
      return authorData;
    }
  }

  return authorData;
}

async function getFileMetaDataById(id) {
  const { data, error } = await supabase.from("fileMetadata").select("*").eq("id", id).single();
  if (error) {
    return { error: "Error fetching file metadata" };
  }
  if (!data.public) {
     delete data.name;
  } else {
    data.publicUrl = `http://localhost:54321/storage/v1/object/public/fileServer/${data.filepath}`;
  }
  delete data.filepath;
  delete data.created_at;
  delete data.fileID;
  delete data.public;

  return data;
}

async function fetchAllRows({ tableName, select = "*", batchSize = 1000, start = 0, data = [] }) {
  const { data: rows, error } = await supabase
    .from(tableName)
    .select(select)
    .range(start, start + batchSize - 1);

  if (error) {
    console.error(`Error fetching rows from ${tableName}:`, error);
    return data;
  }

  if (rows.length === 0) {
    return data;
  }

  return fetchAllRows({ tableName, select, batchSize, start: start + batchSize, data: data.concat(rows) });
}

ini();
