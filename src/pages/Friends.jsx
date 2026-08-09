import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, UserCheck, X, Check, ArrowRight } from 'lucide-react';

export function Friends() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [friendCode, setFriendCode] = useState('');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    fetchFriendsAndRequests();
  }, [user]);

  const fetchFriendsAndRequests = async () => {
    try {
      setLoading(true);
      // Fetch where user is sender or receiver
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          status,
          sender_id,
          receiver_id,
          sender:profiles!sender_id(id, display_name, friend_code),
          receiver:profiles!receiver_id(id, display_name, friend_code)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) throw error;

      const acc = [];
      const req = [];

      data.forEach(rel => {
        const isSender = rel.sender_id === user.id;
        const otherUser = isSender ? rel.receiver : rel.sender;
        
        if (rel.status === 'accepted') {
          acc.push({ ...otherUser, friendship_id: rel.id });
        } else if (rel.status === 'pending' && !isSender) {
          // Only show received requests
          req.push({ ...rel.sender, friendship_id: rel.id });
        }
      });

      setFriends(acc);
      setRequests(req);
    } catch (e) {
      console.error(e);
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!friendCode) return;

    try {
      // Find user by friend code
      const { data: profiles, error: searchError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('friend_code', friendCode.trim().toUpperCase());
        
      if (searchError) throw searchError;
      if (!profiles || profiles.length === 0) {
        throw new Error('User not found with this code');
      }

      const targetUser = profiles[0];
      
      if (targetUser.id === user.id) {
        throw new Error('You cannot add yourself');
      }

      // Check if already friends or requested
      const { data: existing, error: checkError } = await supabase
        .from('friendships')
        .select('id')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetUser.id}),and(sender_id.eq.${targetUser.id},receiver_id.eq.${user.id})`);

      if (checkError) throw checkError;
      if (existing && existing.length > 0) {
        throw new Error('Friendship or request already exists');
      }

      // Insert request
      const { error: insertError } = await supabase
        .from('friendships')
        .insert({
          sender_id: user.id,
          receiver_id: targetUser.id,
          status: 'pending'
        });

      if (insertError) throw insertError;

      setSuccess(`Friend request sent to ${targetUser.display_name}!`);
      setFriendCode('');
    } catch (e) {
      setError(e.message);
    }
  };

  const handleAccept = async (friendshipId) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId)
        .eq('receiver_id', user.id);
        
      if (error) throw error;
      fetchFriendsAndRequests();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (friendshipId) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId)
        .eq('receiver_id', user.id);
        
      if (error) throw error;
      fetchFriendsAndRequests();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zutomayo-accent to-zutomayo-secondary text-glow mb-8">
        Friends
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Add Friend & Requests */}
        <div className="space-y-8">
          
          {/* Add Friend */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-zutomayo-accent" />
              Add Friend
            </h2>
            
            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="text"
                    value={friendCode}
                    onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white font-mono placeholder:font-sans focus:outline-none focus:border-zutomayo-accent focus:ring-1 focus:ring-zutomayo-accent"
                    placeholder="Enter Friend Code"
                    maxLength={8}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!friendCode || friendCode.length < 6}
                className="w-full py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                Send Request
              </button>
              
              {error && <p className="text-sm text-red-400">{error}</p>}
              {success && <p className="text-sm text-green-400">{success}</p>}
            </form>
          </div>

          {/* Pending Requests */}
          {requests.length > 0 && (
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-white mb-4">Friend Requests</h2>
              <div className="space-y-3">
                {requests.map(req => (
                  <div key={req.id} className="bg-black/40 border border-white/10 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">{req.display_name}</p>
                      <p className="text-xs text-zutomayo-light font-mono">{req.friend_code}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAccept(req.friendship_id)} className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">
                        <Check size={16} />
                      </button>
                      <button onClick={() => handleReject(req.friendship_id)} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Friend List */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <UserCheck size={20} className="text-zutomayo-accent" />
            Your Friends
          </h2>

          {loading ? (
            <p className="text-zutomayo-light">Loading friends...</p>
          ) : friends.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zutomayo-light mb-2">You don't have any friends yet.</p>
              <p className="text-sm text-white/40">Share your Friend Code from your Profile to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {friends.map(friend => (
                <div key={friend.id} className="bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col justify-between hover:border-zutomayo-accent/50 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-zutomayo-accent to-zutomayo-secondary rounded-full flex items-center justify-center shrink-0">
                      <span className="font-bold text-white">
                        {friend.display_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-white">{friend.display_name}</p>
                      <p className="text-xs text-zutomayo-light font-mono">{friend.friend_code}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/friends/${friend.id}/collection`)}
                    className="w-full py-2 bg-zutomayo-accent/20 text-zutomayo-accent rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-zutomayo-accent/30 transition-colors"
                  >
                    View Collection
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
