import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import MatchPronos from './components/MatchPronos';
import PlayerPronos from './components/PlayerPronos';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/match-pronos" element={<MatchPronos />} />
          <Route path="/player-pronos" element={<PlayerPronos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;