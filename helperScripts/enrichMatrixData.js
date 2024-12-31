import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import sdk from "matrix-js-sdk";
import path from "path";
import _ from "lodash";
import fetch from "node-fetch";

let matrixData = JSON.parse(fs.readFileSync("./matrixEntries.json", "utf8"));




const matrixClient = sdk.createClient({
  baseUrl: "https://content.udk-berlin.de",
  accessToken: "…",
  userId: "@digitaleklasse-archive-bot:content.udk-berlin.de",
});



if (!fs.existsSync("./matrixData/coverPhotos")) {
  fs.mkdirSync("./matrixData/coverPhotos", { recursive: true });
}

if (!fs.existsSync("./matrixData/stateEvents")) {
  fs.mkdirSync("./matrixData/stateEvents", { recursive: true });
}

for await (const [i, entry] of matrixData.entries()) {
    console.log(i, "/", matrixData.length);
    await new Promise((r) => setTimeout(r, 200))
  const roomId = entry.room_id;
  const stateEvents = await matrixClient.roomState(roomId);
  fs.writeFileSync(`./matrixData/stateEvents/${roomId}.json`, JSON.stringify(stateEvents, null, 2));

  const avatar = _.find(stateEvents, { type: "m.room.avatar" });

  const avatarHttp = matrixClient.mxcUrlToHttp(avatar?.content.url);


  const avatarUrl = avatarHttp;
  if (avatarUrl) {
    const response = await fetch(avatarUrl);

    
    // Extract filename from content-disposition header
    const contentDisposition = response.headers.get('content-disposition');
    let extension = '.png'; // Default extension

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        const filename = match[1];
        extension = path.extname(filename) || extension;
      }
    } else {
      // Fallback to content-type header
      const contentType = response.headers.get('content-type');
      if (contentType) {
        const mime = contentType.split('/')[1];
        extension = `.${mime}`;
      }
    }

    const buffer = await response.buffer();
    fs.writeFileSync(path.join("./matrixData/coverPhotos", `${roomId}${extension}`), buffer);
  }
}
