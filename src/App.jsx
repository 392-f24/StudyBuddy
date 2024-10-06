import * as React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import GroupsPage from './pages/GroupsPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = React.useState(0);

  return (
    <div className="app-wrapper">
      <BrowserRouter>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="groups" element={<GroupsPage />} />
            <Route path="messages" element={<div>TBD</div>} />
            <Route path="profile/:id" element={<ProfilePage />} />
          </Routes>
        </div>
        <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </BrowserRouter>
    </div>
  );
};

export default App;
