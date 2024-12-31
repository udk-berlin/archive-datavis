import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Step 2: Read the JSON file
const studentsData = JSON.parse(fs.readFileSync('./students.json', 'utf8'));

// Step 3: Initialize Supabase client
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = '…'; // Replace with your actual Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);



const fetchStudentAuthorTypeId = async () => {
    const { data, error } = await supabase
      .from('authorTypes')
      .select('id')
      .eq('name', 'student')
      .single();
  
    if (error) {
      console.error('Error fetching authorType id:', error);
      return null;
    }
  
    return data.id;
  };


// Step 4: Insert data into the authors table
const insertAuthors = async () => {
  let counter = 0;
  const studentAuthorTypeId = await fetchStudentAuthorTypeId();
  for (const student of studentsData) {
    counter++;
    // if (counter > 2) break;

    const { name, instagram, website, twitter, bio, mail } = student;
    const nameParts = name.split(' ');
    const lastName = nameParts.pop();
    const firstName = nameParts.join(' ');


    const { data: existingData, error: existingError } = await supabase
      .from('authors')
      .select('*')
      .eq('firstName', firstName)
      .eq('name', lastName);


    if (existingError) {
      console.error('Error checking existing data:', existingError);
      continue;
    }

    if (existingData.length > 0) {
      console.log(`Entry already exists for ${firstName} ${lastName}`);
      continue;
    }

    // Insert the new entry
    if(!firstName || !lastName) continue;
    const { data, error } = await supabase
      .from('authors')
      .insert([
        { name: lastName, firstName: firstName, type: [studentAuthorTypeId], contactInfo: { instagram, website, twitter, bio, mail }, additional : {origin:"kirby"} }
      ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Inserted data:', data);
    }
  }
};

// Execute the function
 insertAuthors();