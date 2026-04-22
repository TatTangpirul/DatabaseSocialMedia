# Social Media App

A full-stack social media web application built with **Next.js**, **PostgreSQL** (Supabase), and **Tailwind CSS**.

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL via Supabase
- **Auth**: JWT stored in HTTP-only cookies
- **Image Upload**: ImgBB API
- **Password Hashing**: Argon2
- **Theme**: next-themes (dark/light mode)
- **Icons**: Lucide React

---

## Features

- User registration and login with JWT authentication
- Dark / light mode toggle
- Create, edit, and delete posts (text and/or image)
- Like and comment on posts
- Sort feed by time or popularity
- Search users by username
- User profile pages with post history
- Trending accounts sidebar
- Today's hottest posts widget
- Profile info editing (username, email, bio, profile image)
- Image upload via URL or device file (ImgBB)

---

## Quick Start (Assignment Submission)

> A `.env` file with working credentials is already included in the submission. No additional setup is needed for environment variables.

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), or the port that the terminal tells, in your browser.

---

## Getting Started (Manual Setup)

### 1. Clone the repository

```bash
git clone https://github.com/yourname/yourrepo.git
cd yourrepo/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the `frontend` folder:

```env
DATABASE_URL=postgresql://your_user:your_password@your_host:5432/postgres
JWT_SECRET=your_random_secret_string
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

### 4. Set up the database

Run the following SQL in your Supabase SQL editor to create the required tables:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile_image_url VARCHAR(500),
  bio TEXT,
  n_posts SMALLINT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  content TEXT,
  image_url VARCHAR(500),
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  post_id INT REFERENCES posts(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  post_id INT REFERENCES posts(id),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


---

## Project Structure

```
app/
  (auth)/               # Auth pages (no main layout)
    login/
    register/
    nickname/
    changeInfo/
  api/                  # API routes
    login/
    register/
    logout/
    me/
    posts/
    users/
    search/
    popular/
  [username]/           # User profile page
  context/              # React contexts (Auth, Feed, Theme)
  MainComponent/        # Shared UI components
    Feed.tsx
    PostForm.tsx
    TopBar.tsx
    AccountInfo.tsx
    MostPopular.tsx
    ProfileDropdown.tsx
    usePostInteractions.ts
  layout.tsx
  page.tsx
lib/
  db.ts                 # PostgreSQL pool
  util/
    postHandler.ts
    searchHandler.ts
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB API key for image uploads |

---

## License

MIT
