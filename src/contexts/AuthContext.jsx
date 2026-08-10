import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };

    getSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const checkNotifications = async (currentProfile) => {
    if (!currentProfile) return;
    try {
      const lastViewed = currentProfile.last_viewed_friends_at || new Date(0).toISOString();
      
      // Check for pending requests received
      const { count: pendingCount, error: pendingError } = await supabase
        .from('friendships')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', currentProfile.id)
        .eq('status', 'pending');
        
      if (pendingError) throw pendingError;
      
      // Check for accepted requests sent (reply)
      const { count: acceptedCount, error: acceptedError } = await supabase
        .from('friendships')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', currentProfile.id)
        .eq('status', 'accepted')
        .gt('updated_at', lastViewed);
        
      if (acceptedError) throw acceptedError;
      
      setHasUnreadNotifications((pendingCount || 0) > 0 || (acceptedCount || 0) > 0);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
      checkNotifications(data);
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateVisibility = async (isPublic) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_public: isPublic })
        .eq('id', user.id);
      if (error) throw error;
      setProfile(prev => ({ ...prev, is_public: isPublic }));
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  const updateLastViewedFriends = async () => {
    if (!user) return;
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('profiles')
        .update({ last_viewed_friends_at: now })
        .eq('id', user.id);
      if (error) throw error;
      setProfile(prev => ({ ...prev, last_viewed_friends_at: now }));
      setHasUnreadNotifications(false);
    } catch (error) {
      console.error('Error updating last viewed:', error);
    }
  };

  // Poll for notifications every 30 seconds if logged in
  useEffect(() => {
    if (!profile) return;
    const interval = setInterval(() => {
      checkNotifications(profile);
    }, 30000);
    return () => clearInterval(interval);
  }, [profile]);

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signUp = (email, password, displayName) => supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        full_name: displayName
      }
    }
  });
  const signInWithGoogle = () => supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/profile'
    }
  });
  const signOut = () => supabase.auth.signOut();

  const value = {
    user,
    profile,
    hasUnreadNotifications,
    fetchProfile,
    updateVisibility,
    updateLastViewedFriends,
    checkNotifications,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
