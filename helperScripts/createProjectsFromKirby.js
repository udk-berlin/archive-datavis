import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Read the JSON file
const projectData = JSON.parse(fs.readFileSync("./projects.json", "utf8"));

// Initialize Supabase client
const supabaseUrl = "http://127.0.0.1:54321";
const supabaseKey =
  "…"; // Replace with your actual Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

let semesters = [];
let authors = [];

const bucketName = "fileServer";
const bucketBasePath = "websiteKirby/content/2_students";

const studentAuthorTypeId = "bed64b51-d680-4766-a39b-f542a68dbb59";

const createdNames = [];






const fetchSemesters = async () => {
  const { data, error } = await supabase.from("semesters").select("*");

  if (error) {
    console.error("Error fetching authorType id:", error);
    return null;
  }

  return data;
};

const fetchAuthors = async () => {
  const { data, error } = await supabase.from("authors").select("*");

  if (error) {
    console.error("Error fetching authorType id:", error);
    return null;
  }

  return data;
};

const capitalizeFirstLetter = (string) => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const createStudent = async (studenHandle) => {
  if (createdNames.includes(studenHandle)) return;
  const splitteted = studenHandle.split("-");
  const firstName = capitalizeFirstLetter(splitteted[splitteted.length - 1]) || "";
  const lastName = capitalizeFirstLetter(splitteted.slice(0, splitteted.length - 1).join(" ")) || "";

  //   console.log(studenHandle, firstName, lastName);
  const { data, error } = await supabase
    .from("authors")
    .insert([{ name: lastName ? lastName : "", firstName: firstName, type: [studentAuthorTypeId], additional: { origin: "kirby" } }]);

  if (!error) {
    createdNames.push(studenHandle);
  }

  return data;
};

function getSemesterId(semester) {
  const semesterId = semesters.find((s) => s.additional.shortHandle === semester);
  return semesterId?.id;
}

function getYearBySemester(semester) {
  const s = semesters.find((s) => s.additional.shortHandle === semester);
  return s?.year;
}

async function getAuthorId(author) {
  const authorId = authors.find((a) => {
    const firstName = a.firstName
      .trim()
      .replaceAll(" ", "-")
      .toLowerCase()
      .replaceAll("ü", "ue")
      .replaceAll("ä", "ae")
      .replaceAll("ö", "oe")
      .replaceAll("ß", "ss");
    const name = a.name
      .trim()
      .replaceAll(" ", "-")
      .toLowerCase()
      .replaceAll("ü", "ue")
      .replaceAll("ä", "ae")
      .replaceAll("ö", "oe")
      .replaceAll("ß", "ss");

    return (name + "-" + firstName).toLowerCase() === author || (firstName + "-" + name).toLowerCase() === author;
  });
  if (!authorId && author.includes("-")) {
    console.log("Author not found: ", author);
    await createStudent(author);
    authors = await fetchAuthors();
    getAuthorId(author);
  } else {
    return authorId?.id;
  }
}

async function create() {
  semesters = await fetchSemesters();
  authors = await fetchAuthors();

 // console.log(await supabase.storage.from("fileServer").getPublicUrl("websiteKirby/content/2_students/students.txt"));
  // console.log(semesters);

  //  projectData.forEach((project) => {
  //     const data = {name: project.name, semester: []}

  //     console.log(getSemesterId(project.semester))

  // });

  for await (const project of projectData) {
    const semesterId = getSemesterId(project.semester);
    let authorId;

    if (project.assets.length > 0) {
      const authorShortHandle = project.assets[0].path.split("/")[3];

      authorId = await getAuthorId(authorShortHandle);
    }
    //    console.log(project.name, project.semester, semesterId)
    //   console.log(authorId)

    const assets = project.assets.map((asset) => {
      return "" + bucketName + "/" + bucketBasePath + asset.path.split("./origin/2_students")[1];
    });

    console.log(assets);

   // return

    const year = getYearBySemester(project.semester);
    const allocation = { temporal: {} };
    year ? (allocation.temporal.year = year) : null;
    const insertData = {
      name: project.name,
      semester: [semesterId],
      dbtype: "kirby",
      assets: assets,
      allocation: allocation,
      authors: authorId ? [authorId] : [],
      abstract: project?.description,
      thumbnail: assets?.length > 0 ? assets[0] : null,
    };

    // console.log(data)
    const { data, error } = await supabase.from("entries").insert([insertData]);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Inserted data:", data);
    }
  }
}

create();
