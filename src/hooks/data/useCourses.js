import { useEffect, useState } from 'react';

import { getCourses } from '@firestore/general';

export default function useCourses() {
  const [CoursesList, setCoursesList] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const Courses = await getCourses();
        setCoursesList(Courses);
      } catch (error) {
        console.error('Error fetching Courses:', error);
      }
    };
    fetchCourses();
  }, []);

  return CoursesList;
}
