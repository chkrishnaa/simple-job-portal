import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { PlacementPrediction } from './pages/PlacementPrediction';
import { ResumeMatching } from './pages/ResumeMatching';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-200">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<PlacementPrediction />} />
            <Route path="/resume" element={<ResumeMatching />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;