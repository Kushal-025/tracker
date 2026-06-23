# WanderMap - Personal Travel Planner

WanderMap is a frontend web application to organize, plan, and track travel adventures. I built this to solve the chaos of managing packing lists, tracking expenses, listing itineraries, and keeping a wishlist of destinations in one clean interface.

Everything runs locally in the browser with state saved directly in `localStorage`, so no backend setup or accounts are needed.

## Features

- **Destination Explorer**: Browse curated destinations with filters for continents and travel styles (beach, culture, adventure, city breaks).
- **Saved Wishlist**: Heart destinations to keep a list of places to go next.
- **Trip Planner**: Create trips, set dates, choose cover photos, and build day-by-day itineraries.
- **Expense & Budget Tracker**: Log expenses under categories (food, lodging, transit, etc.) and check visual charts of budget vs spent.
- **Packing Checklist**: A categorical packing list template (clothes, documents, toiletries, tech) with progress tracking so nothing is left behind.

## Tech Stack

- **React** (State management, Context API)
- **Vite** (Local development environment)
- **Tailwind CSS v4** (Modern utility styling and aurora gradient effects)
- **Lucide React** (Vector iconography)
- **Recharts** (Visual budget breakdowns and category pies)

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local address (usually `http://localhost:5173` or `http://localhost:5174`).

## Deploying to Vercel

The project has been configured with `vercel.json` for easy hosting.

1. Push the code to a GitHub repository.
2. Link your GitHub account to [Vercel](https://vercel.com).
3. Import the repository and deploy. The build command is `npm run build` and output directory is `dist`.
