import { Routes, Route } from 'react-router-dom';
import Desktop from './Desktop';
import Portfolio from './portfolio';

function App() {
  return (
    <Routes>
      {/* Portfolio is the homepage */}
      <Route path="/" element={<Portfolio />} />

      {/* The Web OS lives at /os */}
      <Route path="/os" element={<Desktop />} />
    </Routes>
  );
}

export default App;
