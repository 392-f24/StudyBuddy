import React, { useState } from 'react';

import Footer from '@components/common/Footer';
import Header from '@components/common/Header';
import GroupsPage from '@components/GroupsPage';
import HomePage from '@components/HomePage';
import EditProfile from '@components/Profile/EditProfile';
import ProfilePage from '@components/Profile/ProfilePage';
import TimePreferencesPage from '@components/Profile/TimePreferencesPage';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@utils/theme';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

const AppContent = ({ currentPage, setCurrentPage }) => {
  const location = useLocation();
  const isEditProfilePage = location.pathname === '/edit-profile';
  const isHomePage = location.pathname === '/'; // Check if we are on the HomePage

  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for the filter visibility

  const handleFilterToggle = (forceClose = null) => {
    if (forceClose === false) {
      setIsFilterOpen(false); // Force close the filter
    } else {
      setIsFilterOpen((prev) => !prev); // Toggle the filter
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {!isEditProfilePage && (
        <Header
          onFilterToggle={handleFilterToggle} // Pass filter toggle handler
          isFilterOpen={isFilterOpen} // Pass filter open state
          showFilter={isHomePage} // Only show filter button on HomePage
        />
      )}
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isFilterOpen={isFilterOpen}
                handleFilterToggle={handleFilterToggle} // Pass the filter logic to HomePage
              />
            }
          />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="profile/:id" element={<ProfilePage />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="time-preferences" element={<TimePreferencesPage />} />
        </Routes>
      </div>
      {!isEditProfilePage && <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} />}
    </ThemeProvider>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="app-wrapper">
      <BrowserRouter>
        <AppContent currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </BrowserRouter>
    </div>
  );
};

export default App;
