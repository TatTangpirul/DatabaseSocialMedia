import { CircleUserRound, ImageIcon, SquareUserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext"
import { useState } from "react";

export default function PostForm() {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    return (
        <>
            <div className="flex items-center gap-2">
                {user?.profile_image_url ? (
                    <img
                        src={user.profile_image_url}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <CircleUserRound size={40} className="text-gray-600 self-start" />
                )}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="flex-1 resize-none rounded-md px-3 p-0 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center leading-[2.5rem]"
                    rows={1}
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                onClick={() => {}}
                className="flex items-center gap-1 h-8 p-2 text-gray-600 bg-gray-100 rounded-lg hover:text-blue-500 text-sm cursor-pointer"
                >
                    <ImageIcon size={18} />
                    <span>Photo</span>
                </button>
                <button
                onClick={() => {}}
                className="rounded-md bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 cursor-pointer"
                >
                Post
                </button>
            </div>
        </>
    )

}
