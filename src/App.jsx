import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { DeckList } from './pages/DeckList';
import { DeckBuilder } from './pages/DeckBuilder';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/decks" element={<DeckList />} />
            <Route path="/deck/builder" element={<DeckBuilder />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
