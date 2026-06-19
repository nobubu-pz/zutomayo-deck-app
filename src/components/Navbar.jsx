import React from 'react';
import { NavLink } from 'react-router-dom';
import { Library, LayoutGrid } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="glass-panel border-x-0 border-t-0 rounded-none sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zutomayo-accent to-zutomayo-secondary text-glow">
              ZUTOMAYO DECK
            </span>
          </div>
          <div className="flex space-x-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-zutomayo-accent/20 text-white' : 'text-zutomayo-light hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <LayoutGrid size={18} />
              <span className="hidden sm:inline">Cards</span>
            </NavLink>
            <NavLink 
              to="/decks" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-zutomayo-accent/20 text-white' : 'text-zutomayo-light hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Library size={18} />
              <span className="hidden sm:inline">My Decks</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
