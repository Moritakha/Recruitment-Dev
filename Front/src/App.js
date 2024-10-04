import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import QueensAttack from './components/QueensAttack';
import StringValueChange from './components/StringValueChange';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/problem-1">Problem 1: Queens Attack</Link>
            </li>
            <li>
              <Link to="/problem-2">Problem 2: String Value</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/problem-1" element={<QueensAttack />} />
          <Route path="/problem-2" element={<StringValueChange />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
