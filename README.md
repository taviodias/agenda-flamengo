<img src="./public/logo_agenda_flamengo.png" alt="Agenda Flamengo" width="100"/>

# Agenda Flamengo

Automatically sync Flamengo fixtures directly to your personal Google Calendar. Built with the modern T3 Stack, this app scrapes the latest match data, maintains a lightweight database, and seamlessly updates subscribers' calendars in the background.

### ✨ Features

- **🔐 User-Centric OAuth2 -** Users log in with their Google accounts and grant calendar access. No complex Service Accounts required.

- **🏟️ Advanced Web Scraping -** Uses Cheerio to extract upcoming matches, past results (including penalty shootouts), and venue locations.

- **🧹 Smart Database Pruning -** Implements a "sliding window" logic to keep the Supabase database ultra-lightweight, storing only the 2 latest finished matches and the upcoming schedule.

- **🔄 Secure Background Sync -** Stateless Cron Job architecture using a protected `/api/cron/sync` route, easily triggerable via Vercel Cron or external services.

- **📱 Modern UI -** Responsive match carousel with dynamic transparency variants, fetched PNG team crests, and custom Shadcn/Sonner toast notifications.

- **⏰ Smart Reminders -** Automatically sets a 60 & 10 minute popup reminder before kick-off on the user's phone/calendar.

### 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI (Sonner for Toasts)
- **Database:** PostgreSQL via Supabase
- **ORM:** Drizzle ORM
- **Scraping:** Cheerio
- **Environment:** Docker (Devcontainers)

### ⚙️ Setup & Installation

##### 1. Google Cloud (OAuth Setup)

1. Go to Google Cloud Console
2. Create a new project and enable the Google Calendar API.
3. Go to APIs & Services > OAuth consent screen. Set it up and add the scope: https://www.googleapis.com/auth/calendar.events.
4. Go to Credentials and create an OAuth 2.0 Client ID (Web application).
5. Add your authorized redirect URIs (e.g., http://localhost:3000/api/callback).
6. Copy the Client ID and Client Secret.

##### 2. Supabase (Database Setup)

1. Create a new project on Supabase.
2. Go to Project Settings > Database.
3. Obtain your Transaction Mode connection string (Port 6543) and Session Mode connection string (Port 5432).

##### 3. Environment Variables

Rename .env.example to .env and fill in your keys:
| Secret | Description |
|---|---|
|DATABASE_URL|Supabase Connection Pooling URL (Port 6543) for the app|
|DIRECT_URL|Supabase Direct Connection URL (Port 5432) for Drizzle migrations|
|GOOGLE_CLIENT_ID|From Google Cloud Console|
|GOOGLE_CLIENT_SECRET|From Google Cloud Console|
|CRON_SECRET|A secure, random string to protect your sync API route|

### 🚀 Local Development

This project uses Devcontainers for a frictionless, Dockerized development environment.

1. Clone the repository and open it in VS Code.

2. When prompted, click "Reopen in Container" (This will build the Node.js 22 environment).

3. Open the VS Code terminal inside the container and run:

```bash
# Install dependencies
pnpm install

# Push the Drizzle schema to Supabase (creates tables)
pnpm db:push

# Start the development server
pnpm dev
```

The app will be running at `http://localhost:3000`.

### 🔄 How the Sync Works

1. **Onboarding:** When a user subscribes, the app asks for Calendar permissions, securely stores their refresh_token in Supabase, and immediately syncs upcoming matches to their calendar.

2. **Automated Scraping:** An external Cron service hits the GET /api/cron/sync route using the Authorization: Bearer <CRON_SECRET> header.

3. **Data Update:** Cheerio scrapes the latest fixture data. Drizzle ORM performs an Upsert to update match times/scores and prunes old games.

4. **Calendar Broadcast:** The app iterates through active subscribers, uses their refresh_token to get a fresh access token, and creates/updates the Google Calendar events seamlessly.

### 📄 License

MIT

---

🔴⚫ Uma vez **Flamengo**, sempre **Flamengo!** 🔴⚫
