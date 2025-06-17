import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// main.jsx or App.jsx
import 'intl-tel-input/build/css/intlTelInput.css';
import Home from './pages/Home.jsx';
import Admin from './pages/Admin.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;