'use client';

import { SquareUserRound } from "lucide-react";
import Link from "next/link"

export default function TopBar() {
    return(
        <div id="top" className="flex items-center bg-white p-4 space-x-4">
            <SquareUserRound size={40} className="text-gray-600"/>
            <Link
                href="/login"
                className="inline-block rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Log in
            </Link>
            <Link
                href="/register"
                className="inline-block rounded-md bg-gray-200 px-3 py-1.5 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
                Sign up
            </Link>
        </div>
    );
}