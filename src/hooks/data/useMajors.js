import { useEffect, useState } from 'react';

import { getMajors } from '@firestore/general';

export default function useMajors() {
  const [majorsList, setMajorsList] = useState([]);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const majors = await getMajors();
        setMajorsList(majors);
      } catch (error) {
        console.error('Error fetching majors:', error);
      }
    };
    fetchMajors();
  }, []);

  return majorsList;
}
