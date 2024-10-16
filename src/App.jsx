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

  return (
    <ThemeProvider theme={theme}>
      {!isEditProfilePage && <Header />}
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="groups" element={<GroupsPage />} />
          {/* <Route path="messages" element={<div>TBD</div>} /> */}
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
