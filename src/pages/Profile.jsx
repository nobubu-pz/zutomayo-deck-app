import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Copy, Check, Users } from 'lucide-react';
import { useState } from 'react';

export function Profile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // If not logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleCopy = () => {
    if (profile?.friend_code) {
      navigator.clipboard.writeText(profile.friend_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zutomayo-accent to-zutomayo-secondary text-glow mb-8">
        My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="glass-panel p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-zutomayo-accent to-zutomayo-secondary rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(134,59,255,0.4)]">
            <span className="text-4xl font-bold text-white">
              {profile?.display_name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-1">
            {profile?.display_name || 'Player'}
          </h2>
          <p className="text-zutomayo-light mb-6">{user.email}</p>

          <div className="w-full bg-black/40 border border-white/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-zutomayo-light mb-2">Your Friend Code</p>
            <div className="flex items-center justify-between bg-black/60 rounded p-3 font-mono text-xl tracking-widest text-white border border-white/5">
              <span>{profile?.friend_code || 'Loading...'}</span>
              <button 
                onClick={handleCopy}
                className="text-zutomayo-accent hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
              </button>
            </div>
            <p className="text-xs text-white/40 mt-2 text-left">
              Share this code with friends so they can add you!
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full hover:bg-red-500/20 hover:text-red-300 transition-colors w-full justify-center mt-auto"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Action Cards */}
        <div className="flex flex-col gap-6">
          <div 
            onClick={() => navigate('/friends')}
            className="glass-panel p-6 cursor-pointer hover:border-zutomayo-accent/50 transition-colors group flex items-start gap-4"
          >
            <div className="p-3 rounded-full bg-zutomayo-accent/20 text-zutomayo-accent group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Manage Friends</h3>
              <p className="text-zutomayo-light text-sm">
                Add friends using their Friend Code, accept incoming requests, and view your friends' collections.
              </p>
            </div>
          </div>
          
          <div className="glass-panel p-6 flex flex-col justify-center items-center text-center opacity-50">
            <p className="text-zutomayo-light">More features coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
