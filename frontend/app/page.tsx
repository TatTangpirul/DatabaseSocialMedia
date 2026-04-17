'use client';

import Feed from "./MainComponent/Feed";
import AccountInfo from "./MainComponent/AccountInfo";
import DailyHotPosts from "./MainComponent/DailyHotPosts";

export default function HomePage() {
  return (
    <div className="flex flex-row items-start justify-center p-4 gap-6">
      {/* Left column: Today's hottest posts */}
      <aside className="w-72 shrink-0">
        <DailyHotPosts />
      </aside>

      {/* Middle column: Main feed */}
      <main className="flex-1 max-w-2xl">
        <Feed />
      </main>

      {/* Right column: Account info */}
      <aside className="w-72 shrink-0">
        <AccountInfo />
      </aside>
    </div>
  );
}