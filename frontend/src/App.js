import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import React Router
import Randomator from './Randomator/Randomator';

import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Work from './pages/Work';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import CV from './pages/CV';

import ProjectDetail from './components/ProjectDetail';

function App() {
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight); // Reakce na změnu velikosti okna

    return () => window.removeEventListener('resize', setAppHeight); // Cleanup při unmountu
  }, []);

  // 1. Nastavení stavu pro otevření/zavření menu
  const [nav, setNav] = useState(false);

  // 2. Funkce pro přepínání hodnoty stavu
  const handleClick = () => {
    console.log('Hamburger menu clicked')
    setNav(!nav);
    
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar nav={nav} handleClick={handleClick} />
        <div className='app-container'>
          <Routes>
            {/* Přesměrování na titulní stranu */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/CV" element={<CV />}></Route>
            <Route path="/skills" element={<Skills />}></Route>
            <Route path="/Work" element={<Work />}></Route>
            <Route path="/Contact" element={<Contact />}></Route>
            {/* Dynamický routing pro detail projektu */}
            <Route path="/project/:id" element={<ProjectDetail />} />
            {/* Nová routa pro randomator */}
            <Route path="/randomator" element={<Randomator />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
