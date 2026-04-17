'use client';

import AccountInfo from "../MainComponent/AccountInfo";
import { useEffect, useState } from "react";
import UserPage from "./page";
import MostPopular from "../MainComponent/MostPopular";
import DailyHotPosts from "../MainComponent/DailyHotPosts";

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
      <UserPage />
      <aside className="flex flex-col gap-4 w-72 shrink-0">
              <MostPopular />
              <DailyHotPosts />
            </aside>
    </div>
  );
}