import React from 'react';

import CustomPagination from '@components/common/CustomPagination';
import StudentCard from '@components/Profile/UserCard';
import useStudentData from '@data/useStudentData';
import usePagination from '@hooks/utils/usePagination';
import { Box, Stack, Typography } from '@mui/material';
import { createMatch } from '@utils/firestore/matches';

export default function StudentList({
  userProfile,
  requestedUsers,
  setRequestedUsers,
  matchedUserUids,
  selectedMajors,
  selectedCourses,
  selectedYears,
}) {
  const studentData = useStudentData();
  const filteredStudentData = studentData?.filter((profile) => {
    const profileCourses = profile.listOfCourses || []; // Ensure profile has courses
    // eslint-disable-next-line max-len
    const normalizedSelectedCourses = selectedCourses.map((course) => course.toLowerCase()); // Normalize selected courses to lowercase

    // Ensure filtering conditions for majors, courses, and years
    return (
      profile.uid !== userProfile.uid && // Exclude current user
      !matchedUserUids.has(profile.uid) && // Exclude already matched users
      profile.major !== '' && // Ensure major is defined
      profile.year !== '' && // Ensure year is defined
      (selectedMajors.length === 0 || selectedMajors.includes(profile.major)) && // Filter by major
      (selectedCourses.length === 0 || // Filter by courses (case-insensitive match)
        profileCourses.some((course) =>
          normalizedSelectedCourses.includes(course.toLowerCase()),
        )) &&
      (selectedYears.length === 0 || selectedYears.includes(profile.year)) // Filter by year
    );
  });

  const {
    currentData: studentsToDisplay,
    currentPage,
    totalPages,
    handlePageChange,
  } = usePagination(filteredStudentData || [], 10);

  const handleMatch = async (studentUserProfile) => {
    try {
      await createMatch([studentUserProfile.uid, userProfile.uid], 'University Library');
      setRequestedUsers((prev) => {
        const newSet = new Set(prev);
        newSet.add(studentUserProfile.uid);
        return newSet;
      });
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  return (
    <Box>
      {userProfile && studentsToDisplay?.length > 0 ? (
        <Stack spacing={2}>
          {studentsToDisplay.map((profile, index) => {
            const requested = requestedUsers.has(profile.uid);
            const actions = requested
              ? [{ label: 'Requested', variant: 'outlined', color: 'default', onClick: () => {} }]
              : [{ label: 'Match', onClick: () => handleMatch(profile) }];
            return <StudentCard key={index} studentUserProfile={profile} actions={actions} />;
          })}
        </Stack>
      ) : (
        <Typography variant="h6" color="textSecondary" align="center">
          No students found.
        </Typography>
      )}

      {/* Custom Pagination Component */}
      {filteredStudentData && filteredStudentData.length > 10 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
}
