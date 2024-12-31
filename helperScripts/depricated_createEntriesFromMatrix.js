import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Read the JSON file
const matrixData = JSON.parse(fs.readFileSync("./matrixEntries.json", "utf8"));

// Initialize Supabase client
const supabaseUrl = "http://127.0.0.1:54321";
const supabaseKey =
  "…"; // Replace with your actual Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

let semesters = [];
let authors = [];
let mediatypes = [];
let types = [];

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

const fetchMediaTypes = async () => {
  const { data, error } = await supabase.from("mediatypes").select("*");
  if (error) {
    console.error("Error fetching mediatypes:", error);
    return null;
  }
  return data;
};

const fetchTypes = async () => {
  const { data, error } = await supabase.from("types").select("*");
  if (error) {
    console.error("Error fetching types:", error);
    return null;
  }
  return data;
};

async function ini() {
  semesters = await fetchSemesters();
  authors = await fetchAuthors();
  mediatypes = await fetchMediaTypes();
  types = await fetchTypes();

  const matrixMediums = [];

  for (const entry of matrixData) {
    if (entry.allocation && entry.allocation.semester.year && entry.allocation.semester.rythm) {
    }

    let authorIds = [];
    for (const author of entry.authors) {
        if(!author || author?.length < 2) continue;
        const authorId = await getAuthorId(author);
        if (authorId) {
            authorIds.push(authorId);
        }
    }
   // console.log(authorIds)

    const additional = {
      archive: entry.archive,
      additionalInformation: entry.additionalInformation,
      matrixId: entry.room_id,
      isbn: entry.isbn,
      types: {
        type: entry.type,
        subtype: entry.subType,
      },
    };

    let originalCreated;
    if (entry?.allocation?.temporal && entry?.allocation?.temporal.year) {
      originalCreated = createTimestampWithTimezone(
        entry.allocation.temporal.day || 1,
        entry.allocation.temporal.month || 1,
        entry.allocation.temporal.year
      );
    }

    let semesterId


    if( (entry.allocation.semester.year || entry.allocation.temporal.year) && entry.allocation.semester.rythm){
        semesterId = getSemesterId(entry.allocation.semester.year || entry.allocation.temporal.year, entry.allocation.semester.rythm);
     //  console.log(semesterId);
   }

    

    const insertData = {
      name: entry.name,
      semester: [semesterId],
      dbtype: "matrixPhysicalArchive",
      authors: authorIds || [],
      additional: additional,
      originalCreated: originalCreated,
      allocation: entry.allocation,
    };




    // const { data, error } = await supabase.from("entries").insert([insertData]);

    // if (error) {
    //   console.error("Error inserting data:", error);
    // } else {
    //   console.log("Inserted data:", data);
    // }
  }

  

}

function getSemesterId(year, rythm) {
  let r;
  if (rythm === "sose") {
    r = "ss";
  } else if (rythm === "wise") {
    r = "ws";
  }
  return semesters.find((s) => s.year === parseInt(year) && s.term === r)?.id;
}

const createStudent = async (studenHandle) => {
  if (createdNames.includes(studenHandle)) return;
  const splitteted = studenHandle.split("-");
  const firstName = capitalizeFirstLetter(splitteted[splitteted.length - 1]) || "";
  const lastName = capitalizeFirstLetter(splitteted.slice(0, splitteted.length - 1).join(" ")) || "";

  //   console.log(studenHandle, firstName, lastName);
  const { data, error } = await supabase
    .from("authors")
    .insert([{ name: lastName ? lastName : "", firstName: firstName, type: [studentAuthorTypeId], additional: { origin: "matrixPhysicalArchive" } }]);

  if (!error) {
    createdNames.push(studenHandle);
  }

  return data;
};

async function getAuthorId(author) {
    if(!author.name || author?.name.length < 2) return;

  const authorId = authors.find((a) => {
    const firstName = a.firstName
      .trim()
      .replaceAll(" ", "")
      .toLowerCase()
      .replaceAll("ü", "ue")
      .replaceAll("ä", "ae")
      .replaceAll("ö", "oe")
      .replaceAll("ß", "ss");
    const name = a.name
      .trim()
      .replaceAll(" ", "")
      .toLowerCase()
      .replaceAll("ü", "ue")
      .replaceAll("ä", "ae")
      .replaceAll("ö", "oe")
      .replaceAll("ß", "ss");

    return (name + " " + firstName).toLowerCase() === author.name.toLowerCase() || (firstName + " " + name).toLowerCase() === author.name.toLowerCase();
  });
  if (!authorId ) {
    console.log("Author not found: ", author.name);
    return (author.name)
    console.log("Author not found: ", author.name);
   // await createStudent(author.name,author.email);
    authors = await fetchAuthors();
    getAuthorId(author);
  } else {
    return authorId?.id;
  }
}

const capitalizeFirstLetter = (string) => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const createTimestampWithTimezone = (day, month, year) => {
  // Create a Date object with the given day, month, and year
  const date = new Date(Date.UTC(year, month - 1, day));

  // Format the date to the Berlin timezone
  const options = {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(date);

  return formattedDate;
};

ini();
