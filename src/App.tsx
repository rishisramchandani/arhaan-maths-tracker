import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BossDetail from './pages/BossDetail';
import BossList from './pages/BossList';
import FocusTimer from './pages/FocusTimer';
import Stats from './pages/Stats';
import SkillTree from './pages/SkillTree';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bosses" element={<BossList />} />
            <Route path="/boss/:paper" element={<BossDetail />} />
            <Route path="/focus" element={<FocusTimer />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/tree" element={<SkillTree />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
