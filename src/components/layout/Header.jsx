import React, { useState } from 'react';
import { Layers, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel rounded-none border-t-0 border-x-0 border-b border-zutomayo-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Layers className="text-zutomayo-accent" size={28} />
          <h1 className="text-xl font-bold tracking-wider text-glow">
            ZUTOMAYO DECK
          </h1>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-zutomayo-accent text-glow' : 'text-gray-300 hover:text-white'}`}
          >
            カード一覧
          </Link>
          <Link 
            to="/build" 
            className={`text-sm font-medium transition-colors ${location.pathname === '/build' ? 'text-zutomayo-accent text-glow' : 'text-gray-300 hover:text-white'}`}
          >
            デッキ作成
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-300 hover:text-white active:scale-95 transition-transform"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-zutomayo-darker/98 backdrop-blur-xl border-b border-zutomayo-border/50 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col p-4 gap-2">
            <Link 
              to="/" 
              onClick={closeMenu}
              className={`text-base font-bold p-3 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-zutomayo-accent/20 text-zutomayo-accent border border-zutomayo-accent/30' : 'text-gray-300 hover:bg-white/5 border border-transparent'}`}
            >
              カード一覧
            </Link>
            <Link 
              to="/build" 
              onClick={closeMenu}
              className={`text-base font-bold p-3 rounded-lg transition-colors ${location.pathname === '/build' ? 'bg-zutomayo-accent/20 text-zutomayo-accent border border-zutomayo-accent/30' : 'text-gray-300 hover:bg-white/5 border border-transparent'}`}
            >
              デッキ作成
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
