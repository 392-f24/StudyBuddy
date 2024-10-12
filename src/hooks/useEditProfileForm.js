import { useEffect, useState } from 'react';

import { getMajors, getCourses } from '@firestore/general';
import { getUserProfile, updateUserProfile } from '@firestore/userProfile';

const useEditProfileForm = (user) => {
  const [loading, setLoading] = useState(true);
  const [majorsList, setMajorsList] = useState([]);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    major: '',
    year: '',
    description: '',
    listOfCourses: '',
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [firstTimeUser, setFirstTimeUser] = useState(false);

  useEffect(() => {
    const fetchProfileMajorsAndCourses = async () => {
      if (user && user.uid) {
        try {
          const [data, majorsFromDb, coursesFromDb] = await Promise.all([
            getUserProfile(user.uid),
            getMajors(),
            getCourses(),
          ]);
          setMajorsList(majorsFromDb);
          setCoursesList(coursesFromDb); // Set available courses

          if (data) {
            setFormData({
              name: data.name || '',
              email: data.email || '',
              phoneNumber: data.phoneNumber || '',
              major: data.major || '',
              year: data.year || '',
              description: data.description || '',
            });
            setSelectedMajors(data.major ? data.major.split(',') : []);
            setSelectedCourses(data.listOfCourses || []);
            setFirstTimeUser(Boolean(data.major && data.year));
          }
        } catch (error) {
          console.error('Error fetching profile, majors, and courses:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfileMajorsAndCourses();
  }, [user]);

  useEffect(() => {
    validateForm();
  }, [formData, selectedMajors, selectedCourses]);

  const handleInputChange = (name, value) => {
    if (name === 'phoneNumber') {
      // Format phone number as (XXX)-XXX-XXXX
      let formattedValue = value.replace(/\D/g, ''); // Remove all non-numeric characters
      if (formattedValue.length > 3 && formattedValue.length <= 6) {
        formattedValue = `(${formattedValue.slice(0, 3)})-${formattedValue.slice(3)}`;
      } else if (formattedValue.length > 6) {
        formattedValue = `(${formattedValue.slice(0, 3)})-${formattedValue.slice(3, 6)}-${formattedValue.slice(6, 10)}`;
      } else if (formattedValue.length > 0) {
        formattedValue = `(${formattedValue}`;
      }
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      email: !/^\S+@\S+\.\S+$/.test(formData.email),
      phoneNumber: formData.phoneNumber.replace(/\D/g, '').length !== 10,
      major: selectedMajors.length === 0,
      listClasses: selectedCourses.length === 0,
      year: !formData.year,
    };
    setErrors(newErrors);
    setIsFormValid(!Object.values(newErrors).some((error) => error));
  };

  const handleSubmit = async (userId) => {
    if (isFormValid && userId) {
      try {
        const updatedProfileData = {
          ...formData,
          major: selectedMajors.join(', '),
          listOfCourses: selectedCourses,
          //listOfCourses: formData.listOfCourses.split(',').map((course) => course.trim()),
        };
        await updateUserProfile(userId, updatedProfileData);
        return true; // Indicate success
      } catch (error) {
        console.error('Error updating profile:', error);
        return false; // Indicate failure
      }
    }
    return false; // Indicate failure if form is not valid
  };

  return {
    formData,
    setFormData,
    majorsList,
    selectedMajors,
    setSelectedMajors,
    coursesList,
    selectedCourses,
    setSelectedCourses,
    handleInputChange,
    errors,
    isFormValid,
    firstTimeUser,
    loading,
    handleSubmit,
  };
};

export default useEditProfileForm;
