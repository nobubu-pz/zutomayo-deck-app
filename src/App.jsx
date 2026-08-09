import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { DeckList } from './pages/DeckList';
import { DeckBuilder } from './pages/DeckBuilder';
import { Collection } from './pages/Collection';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Friends } from './pages/Friends';
import { FriendCollection } from './pages/FriendCollection';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/decks" element={<DeckList />} />
            <Route path="/deck/builder" element={<DeckBuilder />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/friends/:friendId/collection" element={<FriendCollection />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
