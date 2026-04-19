'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { CircleUserRound, Check, X, Loader2, ArrowLeft, ImageIcon, Upload } from 'lucide-react';
import { useTheme } from 'next-themes';
import { handleImageUpload } from '@/lib/util/postHandler';

export default function ChangeInfo() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [username, setUsername] = useState('');
    const [originalUsername, setOriginalUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showImageMenu, setShowImageMenu] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (imageMenuRef.current && !imageMenuRef.current.contains(e.target as Node)) {
                setShowImageMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (user) {
            setUsername(user.account ?? '');
            setOriginalUsername(user.account ?? '');
            setBio(user.bio ?? '');
            setProfileImageUrl(user.profile_image_url ?? '');
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) fetchUserInfo();
    }, [user, authLoading]);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch('/api/user/profile');
            const data = await response.json();
            if (data.success) {
                setEmail(data.user.email || '');
                setBio(data.user.bio || '');
                setProfileImageUrl(data.user.profile_image_url || '');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleUrlSubmit = () => {
        setProfileImageUrl(urlInput);
        setShowImageMenu(false);
        setUrlInput('');
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const url = await handleImageUpload(file);
        if (url) setProfileImageUrl(url);
        setUploading(false);
        setShowImageMenu(false);
    };

    const checkUsername = async (newUsername: string) => {
        if (newUsername === originalUsername) { setUsernameAvailable(null); return; }
        if (newUsername.length < 3) { setUsernameAvailable(null); return; }
        setCheckingUsername(true);
        try {
            const response = await fetch(`/api/users/check-username?username=${encodeURIComponent(newUsername)}`);
            const data = await response.json();
            setUsernameAvailable(data.available);
        } catch {
            setUsernameAvailable(null);
        } finally {
            setCheckingUsername(false);
        }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUsername(val);
        checkUsername(val);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username.length < 3) { setMessage({ type: 'error', text: 'Username must be at least 3 characters' }); return; }
        if (usernameAvailable === false) { setMessage({ type: 'error', text: 'Username is already taken' }); return; }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, bio, profile_image_url: profileImageUrl }),
            });
            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setOriginalUsername(username);
                setTimeout(() => router.push(`/${username}`), 1500);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return (
        <div className={`flex justify-center items-center h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-50'}`}>
            <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
    );

    if (!user) return null;

    const inputClass = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${isDark ? 'bg-slate-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`;
    const labelClass = `block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

    return (
        <div>
            <div className={`mt-10 max-w-md mx-auto rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}>

                {/* Header */}
                <div className={`relative h-16 flex items-center px-4 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                    <button
                        onClick={() => router.back()}
                        className={`p-1.5 rounded-full transition ${isDark ? 'hover:bg-slate-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className={`absolute left-1/2 -translate-x-1/2 font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        Edit Profile
                    </h1>
                </div>

                {/* Avatar */}
                <div className="flex justify-center mt-6 mb-2">
                    <div className="relative">
                        {profileImageUrl ? (
                            <img
                                src={profileImageUrl}
                                alt="Profile"
                                className={`w-24 h-24 rounded-full object-cover border-4 shadow-md ${isDark ? 'border-slate-800' : 'border-white'}`}
                                onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                            />
                        ) : (
                            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center shadow-md ${isDark ? 'border-slate-800 bg-slate-700' : 'border-white bg-gray-100'}`}>
                                <CircleUserRound size={56} className="text-gray-400" />
                            </div>
                        )}
                        {profileImageUrl && (
                            <button
                                onClick={() => setProfileImageUrl('')}
                                className="absolute top-0 right-0 bg-black bg-opacity-50 rounded-full p-0.5 text-white"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="px-8 pb-8 pt-4">
                    {message && (
                        <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Profile Image */}
                        <div>
                            <label className={labelClass}>Profile Image</label>
                            <div className="relative" ref={imageMenuRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowImageMenu(!showImageMenu)}
                                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm border transition ${isDark ? 'border-gray-600 text-gray-300 hover:bg-slate-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <ImageIcon size={16} />
                                    {profileImageUrl ? 'Change Photo' : 'Add Photo'}
                                </button>

                                {showImageMenu && (
                                    <div className={`absolute left-0 top-full mt-1 w-full rounded-md shadow-lg border z-50 ${isDark ? 'bg-slate-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                        <div className={`p-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                                            <p className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Paste image link</p>
                                            <div className="flex gap-1">
                                                <input
                                                    type="text"
                                                    value={urlInput}
                                                    onChange={(e) => setUrlInput(e.target.value)}
                                                    placeholder="https://..."
                                                    className={`flex-1 text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDark ? 'bg-slate-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200'}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleUrlSubmit}
                                                    disabled={!urlInput.trim()}
                                                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded disabled:opacity-50"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            <Upload size={16} />
                                            {uploading ? 'Uploading...' : 'Upload from device'}
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className={labelClass}>Username</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    className={`${inputClass} pr-9 ${
                                        usernameAvailable === false ? 'border-red-500 focus:ring-red-500' :
                                        usernameAvailable === true && username !== originalUsername ? 'border-green-500 focus:ring-green-500' : ''
                                    }`}
                                    required
                                />
                                <div className="absolute right-3 top-2.5">
                                    {checkingUsername && <Loader2 size={16} className="animate-spin text-gray-400" />}
                                    {!checkingUsername && usernameAvailable === true && username !== originalUsername && <Check size={16} className="text-green-500" />}
                                    {!checkingUsername && usernameAvailable === false && <X size={16} className="text-red-500" />}
                                </div>
                            </div>
                            {usernameAvailable === false && <p className="text-xs text-red-500 mt-1">Username is already taken</p>}
                            {usernameAvailable === true && username !== originalUsername && <p className="text-xs text-green-500 mt-1">Username is available!</p>}
                            {username.length > 0 && username.length < 3 && <p className="text-xs text-red-500 mt-1">Must be at least 3 characters</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className={labelClass}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className={inputClass}
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className={labelClass}>Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell something about yourself..."
                                rows={3}
                                maxLength={200}
                                className={`${inputClass} resize-none`}
                            />
                            <p className={`text-xs mt-1 text-right ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{bio.length}/200</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || usernameAvailable === false || username.length < 3}
                            className="w-full py-2.5 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}