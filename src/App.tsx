import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CandidateForm } from './pages/CandidateForm';
import { Recommendations } from './pages/Recommendations';
import { AdminDashboard } from './pages/AdminDashboard';
import './i18n';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="form" element={<CandidateForm />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;