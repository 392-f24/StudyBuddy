import * as React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Footer from './components/Footer';
import GroupsPage from './components/GroupsPage';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import { useAuthState } from './utils/firebase';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [user, error] = useAuthState();

  if (error) {
    return <h1>Error fetching user data</h1>;
  }

  return (
    <div className="app-wrapper">
      <BrowserRouter>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
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
