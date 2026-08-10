import React from 'react';
import { NavLink } from 'react-router-dom';
import { Library, LayoutGrid, Bookmark, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { user, hasUnreadNotifications } = useAuth();

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
            <NavLink 
              to="/collection" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-zutomayo-accent/20 text-white' : 'text-zutomayo-light hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Bookmark size={18} />
              <span className="hidden sm:inline">Collections</span>
            </NavLink>
            <NavLink 
              to={user ? "/profile" : "/login"} 
              className={({ isActive }) => 
                `relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-zutomayo-accent/20 text-white' : 'text-zutomayo-light hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <div className="relative">
                <User size={18} />
                {hasUnreadNotifications && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-black"></span>
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">{user ? "Profile" : "Login"}</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
