'use client';

import { CircleUserRound, Home, Users, Newspaper, Calendar, MessageCircle, Bell, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const menuItems = [
    { icon: Home, label: 'Feed' },
    { icon: Users, label: 'Connections' },
    { icon: Newspaper, label: 'Latest News' },
    { icon: Calendar, label: 'Events' },
    { icon: MessageCircle, label: 'Groups' },
    { icon: Bell, label: 'Notifications' },
    { icon: Settings, label: 'Settings' },
];

export default function AccountInfo() {
    const { user } = useAuth();
    console.log(user);

    return (
        <div className="w-64 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-24 overflow-hidden">
              <img 
                  src='/image.png'
                  alt="Banner"
                  className="w-full h-auto object-cover object-top"
                  style={{ height: '100%' }}
              />
          </div>

            {/* Profile image */}
            <div className="flex justify-center -mt-10 mb-2">
                {user?.profile_image_url ? (
                    <img
                        src={user.profile_image_url}
                        alt="Profile"
                        className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-xl border-4 border-white shadow bg-gray-100 flex items-center justify-center">
                        <CircleUserRound size={48} className="text-gray-400" />
                    </div>
                )}
            </div>

            {/* Name and bio */}
            <div className="text-center px-4 pb-4">
                <h2 className="text-lg font-bold text-gray-900">{user?.account ?? 'Guest'}</h2>
                {user?.bio && <p className="text-sm text-gray-500 mt-1">{user.bio}</p>}
                {!user?.bio && <p className="text-sm text-gray-500 mt-1">No bio yet</p>}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-around px-4 py-3 border-t border-b border-gray-100">
                <div className="text-center">
                    <p className="font-bold text-gray-900">{user?.n_posts ?? 0}</p>
                    <p className="text-xs text-gray-500">Posts</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                    <p className="font-bold text-gray-900">{user?.followers ?? 0}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                    <p className="font-bold text-gray-900">{user?.n_likes ?? 0}</p>
                    <p className="text-xs text-gray-500">Likes</p>
                </div>
            </div>

            {/* Menu */}
            <div className="px-4 py-3 space-y-1">
                {menuItems.map(({ icon: Icon, label }) => (
                    <button
                        key={label}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
                    >
                        <Icon size={20} />
                        <span className="font-semibold text-sm">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}