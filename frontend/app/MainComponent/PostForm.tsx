'use client';

import { CircleUserRound, ImageIcon, Upload, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { handlePost, handleImageUpload } from "@/lib/util/postHandler";
import { useTheme } from "next-themes";

export default function PostForm({ onPostSuccess }: { onPostSuccess: () => void }) {
    const { user } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [showImageMenu, setShowImageMenu] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageMenuRef = useRef<HTMLDivElement>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (imageMenuRef.current && !imageMenuRef.current.contains(e.target as Node)) {
                setShowImageMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUrlSubmit = () => {
        setImageUrl(urlInput);
        setShowImageMenu(false);
        setUrlInput('');
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const url = await handleImageUpload(file);
        if (url) setImageUrl(url);
        setUploading(false);
        setShowImageMenu(false);
    };

    const onPost = () => {
        handlePost(content, imageUrl || undefined, () => {
            setContent('');
            setImageUrl('');
            onPostSuccess();
        });
    };

    return (
        <>
            <div className="flex items-center gap-2">
                {user?.profile_image_url ? (
                    <img src={user.profile_image_url} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <CircleUserRound size={40} className={`self-start ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                )}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className={`flex-1 resize-none rounded-md px-3 p-0 text-sm focus:outline-none focus:ring-0 leading-[2.5rem] bg-transparent ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-800'}`}
                    rows={1}
                />
            </div>

            {imageUrl && (
                <div className="relative mt-2">
                    <img src={imageUrl} alt="Preview" className="w-full rounded-md object-cover max-h-48" />
                    <button
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-0.5 text-white"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            <div className="flex items-center justify-between relative">
                <div className="relative" ref={imageMenuRef}>
                    <button
                        onClick={() => setShowImageMenu(!showImageMenu)}
                        className={`flex items-center gap-1 h-8 p-2 rounded-lg hover:text-blue-500 text-sm cursor-pointer ${isDark ? 'text-gray-400 bg-slate-700 hover:bg-slate-600' : 'text-gray-600 bg-gray-100'}`}
                    >
                        <ImageIcon size={18} />
                        <span>Photo</span>
                    </button>

                    {showImageMenu && (
                        <div className={`absolute left-0 top-full mt-1 w-56 rounded-md shadow-lg border z-50 ${isDark ? 'bg-slate-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                            <div className={`p-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                                <p className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Paste image link</p>
                                <div className="flex gap-1">
                                    <input
                                        type="text"
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        placeholder="https://..."
                                        className={`flex-1 text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDark ? 'bg-slate-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-800'}`}
                                    />
                                    <button
                                        onClick={handleUrlSubmit}
                                        disabled={!urlInput.trim()}
                                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded disabled:opacity-50"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                            <button
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

                <button
                    onClick={onPost}
                    disabled={!content.trim() && !imageUrl}
                    className="rounded-md bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Post
                </button>
            </div>
        </>
    );
}