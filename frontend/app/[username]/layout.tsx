'use client';

import AccountInfo from "../MainComponent/AccountInfo";
import DailyHotPosts from "../MainComponent/DailyHotPosts";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-start justify-center p-4 gap-6">

          {/* Left column: Daily hottest posts */}
      <aside className="w-72 shrink-0">
        <DailyHotPosts />
      </aside>
      
      {/* Middle column: Main content (user posts) */}
      <main className="flex-1 max-w-2xl">
        {children}
      </main>

      {/* Right column: Account info */}
      <aside className="w-72 shrink-0">
        <AccountInfo />
      </aside>
          
    </div>
  );
}