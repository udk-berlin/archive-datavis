import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import fs from "fs";

// Read the config file
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

const supabaseUrl = "http://127.0.0.1:54321";
const supabaseKey =
  "…"; // Replace with your actual Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateHash(filePath) {
  const { data, error } = await supabase.storage.from("fileServer").download(filePath);
  if (error) {
    console.error("Error downloading file:", error);
    return;
  }
  const hash = crypto.createHash("sha256");
  const buffer = Buffer.from(await data.arrayBuffer());
  hash.update(buffer);
  return hash.digest("hex");
}

async function processDirectory(directoryPath = "", parentUuid) {
  const { data, error } = await supabase.storage.from("fileServer").list(directoryPath);

  if (error) {
    console.error("Error listing files:", error);
    return;
  }

  for (const item of data) {
    const itemPath = `${directoryPath}/${item.name}`;
    const isDirectory = !item.metadata || Object.keys(item.metadata).length === 0;
    const type = isDirectory ? "directory" : "file";
    const hash = isDirectory ? crypto.createHash("sha256").update(itemPath).digest("hex") : await generateHash(itemPath);
    const mimeType = isDirectory ? null : item.metadata.mimetype;
    const fileSize = isDirectory ? null : item.metadata.size;
    const fileType = isDirectory ? null : item.name.split(".").pop();
    const firstNameChar = item.name.charAt(0);
    const nameLength = item.name.length;

    // Generate filepath hash with salt
    const filepathHash = crypto
      .createHash("sha256")
      .update(itemPath + config.salt)
      .digest("hex");

    // Check if entry already exists
    const { data: existingData, error: existingError } = await supabase.from("fileMetadata").select("id").eq("filepath", itemPath).single();

    if (existingError && existingError.code !== "PGRST116") {
      console.error("Error checking existing file metadata:", existingError);
      continue;
    }

    let id;
    if (existingData) {
      id = existingData.id;
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from("fileMetadata")
        .insert({
          name: item.name,
          filepath: itemPath,
          parent: parentUuid,
          type,
          hash,
          mimetype: mimeType,
          filetype: fileType,
          firstNameChar,
          filesize: fileSize,
          namelength: nameLength,
          filepathHash: filepathHash,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Error inserting file metadata:", insertError);
        continue;
      }

      id = insertData.id;
    }

    if (isDirectory) {
      await processDirectory(itemPath, id);
    }
  }
}

async function updateParentChildren() {
  const files = await fetchAllRows({ tableName: "fileMetadata", select: "id, parent" });

  console.log(files.length)

  for (const file of files) {
    const parentId = file.parent;
    if (parentId) {
      const { data: parentData, error: parentError } = await supabase.from("fileMetadata").select("children").eq("id", parentId).single();

      if (parentError) {
        console.error("Error fetching parent metadata:", parentError);
        continue;
      }

      const children = parentData.children || [];
      if (!children.includes(file.id)) {
        children.push(file.id);

        const { error: updateError } = await supabase.from("fileMetadata").update({ children }).eq("id", parentId);

        if (updateError) {
          console.error("Error updating parent metadata:", updateError);
        }
      }
    }
  }
}


async function fetchAllRows( {tableName, select = "*", batchSize = 1000, start = 0, data = []}) {
    const { data: rows, error } = await supabase.from(tableName).select(select).range(start, start + batchSize - 1);
    
    if (error) {
        console.error(`Error fetching rows from ${tableName}:`, error);
        return data;
    }
    
    if (rows.length === 0) {
        return data;
    }
    
    return fetchAllRows({ tableName, select, batchSize, start: start + batchSize, data: data.concat(rows) });

 
}

processDirectory('websiteKirby').then(() => {
  updateParentChildren();
});
