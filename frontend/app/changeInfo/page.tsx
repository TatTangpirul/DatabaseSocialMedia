'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { CircleUserRound, Check, X, Loader2 } from 'lucide-react';

export default function ChangeInfo() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user) {
      fetchUserInfo();
    }
  }, [user, authLoading]);
  
  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      if (data.success) {
        setUsername(data.user.username);
        setOriginalUsername(data.user.username);
        setProfileImageUrl(data.user.profile_image_url || '');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };
  
  const checkUsername = async (newUsername: string) => {
    if (newUsername === originalUsername) {
      setUsernameAvailable(null);
      return;
    }
    
    if (newUsername.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    setCheckingUsername(true);
    try {
      const response = await fetch(`/api/users/check-username?username=${encodeURIComponent(newUsername)}`);
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };
  
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    checkUsername(newUsername);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.length < 3) {
      setMessage({ type: 'error', text: 'Username must be at least 3 characters' });
      return;
    }
    
    if (usernameAvailable === false) {
      setMessage({ type: 'error', text: 'Username is already taken' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          profile_image_url: profileImageUrl,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setOriginalUsername(username);
        
        setTimeout(() => {
          router.push(`/${username}`);
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };
  
  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Change Account Info</h1>
        
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                  }}
                />
              ) : (
                <CircleUserRound size={96} className="text-gray-400 bg-gray-100 rounded-full" />
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image URL
            </label>
            <input
              type="text"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a URL for your profile picture
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  usernameAvailable === false ? 'border-red-500' :
                  usernameAvailable === true && username !== originalUsername ? 'border-green-500' : 'border-gray-300'
                }`}
                required
              />
              <div className="absolute right-3 top-2.5">
                {checkingUsername && <Loader2 size={18} className="animate-spin text-gray-400" />}
                {!checkingUsername && usernameAvailable === true && username !== originalUsername && (
                  <Check size={18} className="text-green-500" />
                )}
                {!checkingUsername && usernameAvailable === false && (
                  <X size={18} className="text-red-500" />
                )}
              </div>
            </div>
            {usernameAvailable === false && (
              <p className="text-xs text-red-500 mt-1">Username is already taken</p>
            )}
            {usernameAvailable === true && username !== originalUsername && (
              <p className="text-xs text-green-500 mt-1">Username is available!</p>
            )}
            {username.length > 0 && username.length < 3 && (
              <p className="text-xs text-red-500 mt-1">Username must be at least 3 characters</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || usernameAvailable === false || username.length < 3}
            className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}