import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Copy, Check, Users, Edit2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Profile() {
  const { user, profile, fetchProfile, signOut, updateVisibility, hasUnreadNotifications } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditName(profile.display_name || '');
    }
  }, [profile]);

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

  const handleSaveName = async () => {
    if (!editName.trim() || editName === profile.display_name) {
      setIsEditing(false);
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: editName.trim() })
        .eq('id', user.id);
        
      if (error) throw error;
      
      await fetchProfile(user.id);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update name:', err.message);
    } finally {
      setIsSaving(false);
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
          
          {isEditing ? (
            <div className="flex items-center gap-2 mb-1 w-full max-w-[200px]">
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-black/40 border border-zutomayo-accent rounded px-2 py-1 text-white text-center focus:outline-none"
                autoFocus
              />
              <button 
                onClick={handleSaveName}
                disabled={isSaving}
                className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/40 disabled:opacity-50 transition-colors"
                title="Save"
              >
                <Check size={16} />
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditName(profile?.display_name || '');
                }}
                disabled={isSaving}
                className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 disabled:opacity-50 transition-colors"
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-1 group relative">
              <h2 className="text-2xl font-bold text-white">
                {profile?.display_name || 'Player'}
              </h2>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-zutomayo-light hover:text-white transition-colors"
                title="Edit Name"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
          
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
            className="glass-panel p-6 cursor-pointer hover:border-zutomayo-accent/50 transition-colors group flex items-start gap-4 relative"
          >
            <div className="relative">
              <div className="p-3 rounded-full bg-zutomayo-accent/20 text-zutomayo-accent group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              {hasUnreadNotifications && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-black"></span>
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Manage Friends</h3>
              <p className="text-zutomayo-light text-sm">
                Add friends using their Friend Code, accept incoming requests, and view your friends' collections.
              </p>
            </div>
          </div>
          
          <div className="glass-panel p-6 flex flex-col items-start gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Privacy Settings</h3>
              <p className="text-zutomayo-light text-sm mb-4">
                Choose whether your friends can see your card collection.
              </p>
              
              <label className="flex items-center cursor-pointer gap-3">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={profile?.is_public ?? true}
                    onChange={(e) => updateVisibility(e.target.checked)}
                  />
                  <div className={`block w-12 h-6 rounded-full transition-colors ${profile?.is_public !== false ? 'bg-zutomayo-accent' : 'bg-gray-600'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${profile?.is_public !== false ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <span className="text-white font-medium">
                  {profile?.is_public !== false ? 'Collection is Public' : 'Collection is Private'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
