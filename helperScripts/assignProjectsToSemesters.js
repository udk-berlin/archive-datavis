import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Read the JSON file
const kirbyProjectData = JSON.parse(fs.readFileSync("./projects.json", "utf8"));
const kirbySemesterData = JSON.parse(fs.readFileSync("./semesters.json", "utf8"));

// Initialize Supabase client
const supabaseUrl = "http://127.0.0.1:54321";
const supabaseKey =
  "…"; // Replace with your actual Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

let semesters = [];
let projects = [];

const fetchSemesters = async () => {
  const { data, error } = await supabase.from("semesters").select("*");

  if (error) {
    console.error("Error fetching authorType id:", error);
    return null;
  }

  return data;
};

const fetchProjects = async () => {
  const { data, error } = await supabase.from("entries").select("*");

  if (error) {
    console.error("Error fetching authorType id:", error);
    return null;
  }

  return data;
};

async function assignProjectsToSemesters() {
    for (const kirbyProject of kirbyProjectData ) {
        const semester = semesters.find(semester => semester.additional.shortHandle === kirbyProject.semester);
        const project = projects.find(project => project.name === kirbyProject.name);

        if(semester && project) {
           
          console.log(semester.entries)
            if(!semester.entries || !semester.entries.includes(project.id)) {
                const updatedEntries = semester.entries ? [...semester.entries, project.id] : [project.id];
                semester.entries = updatedEntries;
                const { data, error } = await supabase
                .from('semesters')
                .update({ entries: updatedEntries })
                .eq('id', semester.id);
      
              if (error) {
                console.error(`Error updating semester ${semester.id}:`, error);
              } else {
               // console.log(`Updated semester ${semester.id} with new entries.`);
               console.log(`Assigning project ${project.name} to semester ${semester.additional.shortHandle}`);
              }
            }
           
        }
    }
}

async function ini() {
  semesters = await fetchSemesters();
  projects = await fetchProjects();
//   console.log(semesters);
//   console.log(projects);
  await assignProjectsToSemesters();
}

ini();
