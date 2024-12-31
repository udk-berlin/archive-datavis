import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read the JSON file
const semestersData = JSON.parse(fs.readFileSync('./semesters.json', 'utf8'));

// Initialize Supabase client
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = '…'; // Replace with your actual Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);


const typesUuid = {
  'semester': 'f9f146a0-34ab-42df-92fe-27569cd8ad32',
  'short': 'd8e07097-ee2b-4210-abaa-4046bfd6bb75'
}


// Function to insert data into the semesters table
const insertSemesters = async () => {
  for (const semester of semestersData) {
    const { semester: semesterName, shortHandle, topic } = semester;
    let [year, term] = shortHandle.split('-');

    const cleanedTopic = topic.replace(/\s*\(.*?\)\s*/g, '').trim();


    const isShortTerm = /Short|short|Short-term|short-term/.test(topic);
    console.log( { year, term, name: topic, type : isShortTerm ? typesUuid['short'] : typesUuid['semester'] } );


    const { data, error } = await supabase
      .from('semesters')
      .insert([
        { year, term, name: cleanedTopic, type: isShortTerm ? typesUuid['short'] : typesUuid['semester'], additional: { shortHandle: semester.shortHandle } }
      ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Inserted data:', data);
    }
  }
};

// Execute the function
insertSemesters();