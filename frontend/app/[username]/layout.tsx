'use client';

import AccountInfo from "../MainComponent/AccountInfo";
import { useEffect, useState } from "react";
import UserPage from "./page";
import MostPopular from "../MainComponent/MostPopular";

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
      <MostPopular />
    </div>
  );
}