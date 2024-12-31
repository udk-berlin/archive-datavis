import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const matrixData = JSON.parse(fs.readFileSync("./matrixEntries.json", "utf8"));

//const matrixData = [matrixDataA[0]];

const supabaseUrl = "http://127.0.0.1:54321";
const supabaseKey =
  "…"; // Replace with your actual Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

const bucketName = "fileServer";
const bucketBasePath = "matrixCoverPhotos";

const errorIds = [];

const insertMatrixData = async () => {
  for await (const entry of matrixData) {
    
    const { data: existingType, error: existingTypeError } = await supabase.from("type").select("*").eq("name", entry.type).single();

    if (existingTypeError) {
      console.error("Error fetching existing type:", existingTypeError, entry.room_id);
      errorIds.push(entry.room_id);
      //return null;
    }

    const { data: existingMedium, error: existingMediumError } = await supabase
      .from("medium")
      .select("*")
      .eq("name", entry.medium)
      .single();

    if (existingMediumError) {
      console.error("Error fetching existing medium:", existingMediumError, entry.room_id);
      errorIds.push(entry.room_id);
     // return null;
    }

    const { data: existingSubType, error: existingSubTypeError } = await supabase
      .from("subType")
      .select("*")
      .eq("name", entry["subType"])
      .single();

    if (existingSubTypeError) {
      console.error("Error fetching existing subtype:", existingSubTypeError, entry.room_id);
        errorIds.push(entry.room_id);
     // return null;
    }

    const thumbnailBucketUrl = `${bucketName}/${bucketBasePath}/${entry.room_id}.jpeg`;



    

    // return
    const { data, error } = await supabase
      .from("archive")
      .insert([
        {
          matrixId: entry.room_id,
          name: entry.name,
          archiveAuthors: entry.authors,
          type: existingType?.id || null,
          medium: existingMedium?.id || null,
          subType: existingSubType?.id || null,
          col: entry.archive.column,
          row: entry.archive.row,
          physicalId: entry.archive.physicalId,
          additionalInformation: entry.additionalInformation,
          thumbnail: thumbnailBucketUrl,
          allocation: entry.allocation,
          references: entry.references,
        },
      ]);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Inserted data:", data);
    }
  }
  console.log(errorIds)
};

insertMatrixData();
