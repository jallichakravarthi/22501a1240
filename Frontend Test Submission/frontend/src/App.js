import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Statistics from './pages/Statistics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Statistics />} />
      </Routes>
    </Router>
  );
}

export default App;
