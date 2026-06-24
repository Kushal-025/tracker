# Rohit's Fitness Tracker

A personal health and fitness tracker I built to monitor my daily workouts, nutrition, hydration, sleep, and overall progress.

## Features

- **Dashboard** - Daily overview with steps, calories, water intake, sleep, and heart rate
- **Workouts** - Log and track workouts by type (cardio, strength, flexibility, HIIT, sports)
- **Nutrition** - Track meals with calorie and macronutrient breakdown
- **Hydration** - Water intake tracker with visual progress
- **Sleep** - Sleep duration and quality logger
- **Progress** - Charts for weight trend, steps, and weekly consistency
- **Goals** - Set custom daily targets for each metric
- **Achievements** - Unlock badges as you hit fitness milestones

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- Recharts (for all data visualizations)
- Lucide React (icons)
- LocalStorage for data persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
```

The output goes to the `dist/` folder. You can deploy this to Vercel, Netlify, or any static host.

## Deployment

This project is deployed on Vercel. Any push to `main` triggers an automatic redeploy.
