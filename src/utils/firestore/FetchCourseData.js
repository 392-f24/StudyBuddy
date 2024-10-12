// Import modules
import { writeFile } from 'fs/promises';

async function fetchDataAndSave() {
  try {
    // Fetch latest term info data from the API
    const TermResponse = await fetch('https://api.dilanxd.com/paper/data', { method: 'GET' });
    if (!TermResponse.ok) {
      throw new Error(`Failed to fetch data: ${TermResponse.statusText}`);
    }
    //store the latest term info data
    const TermData = await TermResponse.json();
    const LatestTerm = TermData.latest;
    console.log('Latest Term:', LatestTerm);
    if (!LatestTerm) {
      throw new Error(`'latest' term not found in initial data`);
    }

    // Extract the name of the latest term from the fetched data
    const termName = TermData.terms[LatestTerm].name;
    console.log('Latest Term Name:', termName);

    // get the term class info from the api
    const ClassResponse = await fetch(`https://cdn.dil.sh/paper-data/${LatestTerm}.json`, {
      method: 'GET',
    });
    if (!ClassResponse.ok) {
      throw new Error(`Failed to fetch class data: ${ClassResponse.statusText}`);
    }
    const ClassData = await ClassResponse.json(); //"u" -- subject; "n" -- course number
    console.log('Class Data fetched successfully');

    // Combine the data from both APIs
    const data = {
      latestTermNumber: LatestTerm,
      latestTerm: termName,
      ClassData,
    };

    // save all the class numbers into a array

    // await writeFile('CoursesData.json', JSON.stringify(ClassData, null, 2));
    // console.log('Data successfully saved to CoursesData.json');
  } catch (error) {
    console.error('Error fetching or saving data:', error);
  }
}

// Run the function
fetchDataAndSave();
