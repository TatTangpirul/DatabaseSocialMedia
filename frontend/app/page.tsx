'use client';

import Feed from "./MainComponent/Feed";
import AccountInfo from "./MainComponent/AccountInfo";
import MostPopular from "./MainComponent/MostPopular";
import DailyHotPosts from "./MainComponent/DailyHotPosts";  // 新增导入
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="flex flex-row items-start justify-center p-4 gap-8">
      <AccountInfo />
      <Feed />
      <aside className="flex flex-col gap-4 w-64 shrink-0">
        <MostPopular />
        <DailyHotPosts />
      </aside>
    </div>
  );
}