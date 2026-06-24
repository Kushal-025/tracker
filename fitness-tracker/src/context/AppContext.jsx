import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const defaultGoals = {
  steps: 10000,
  calories: 2200,
  water: 8,
  sleep: 8,
  workouts: 5,
};

const generateWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    steps:    Math.floor(Math.random() * 5000) + 5000,
    calories: Math.floor(Math.random() * 600)  + 1600,
    water:    Math.floor(Math.random() * 4)    + 5,
    sleep:    (Math.random() * 3 + 5.5).toFixed(1),
    workout:  Math.random() > 0.3,
  }));
};

const defaultWorkouts = [
  { id: 1, name: 'Morning Run',  type: 'cardio',      duration: 35, calories: 320, date: new Date().toDateString(),                          icon: '🏃' },
  { id: 2, name: 'Push Day',     type: 'strength',    duration: 55, calories: 410, date: new Date().toDateString(),                          icon: '💪' },
  { id: 3, name: 'Yoga Flow',    type: 'flexibility', duration: 40, calories: 180, date: new Date(Date.now() - 86400000).toDateString(),     icon: '🧘' },
];

const defaultMeals = [
  { id: 1, name: 'Oatmeal & Berries',       type: 'breakfast', calories: 340, protein: 12, carbs: 58, fat:  8, time: '08:30', date: new Date().toDateString() },
  { id: 2, name: 'Grilled Chicken Salad',   type: 'lunch',     calories: 480, protein: 42, carbs: 22, fat: 18, time: '13:00', date: new Date().toDateString() },
  { id: 3, name: 'Protein Shake',           type: 'snack',     calories: 180, protein: 28, carbs: 12, fat:  4, time: '16:30', date: new Date().toDateString() },
];

const defaultSleepLogs = [
  { id: 1, date: new Date().toDateString(),                        bedtime: '23:00', wakeup: '06:12', duration: 7.2,  quality: 4, notes: 'Felt refreshed'    },
  { id: 2, date: new Date(Date.now() - 86400000).toDateString(),   bedtime: '23:30', wakeup: '06:45', duration: 7.25, quality: 3, notes: 'Slightly restless' },
];

const defaultWeightLog = [
  { date: '2026-06-16', weight: 75.8 },
  { date: '2026-06-17', weight: 75.5 },
  { date: '2026-06-18', weight: 75.2 },
  { date: '2026-06-19', weight: 75.0 },
  { date: '2026-06-20', weight: 74.8 },
  { date: '2026-06-21', weight: 74.6 },
  { date: '2026-06-23', weight: 74.5 },
];

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [goals, setGoalsState] = useState(() => {
    const s = localStorage.getItem('fitnessGoals');
    return s ? JSON.parse(s) : defaultGoals;
  });

  const [todayStats, setTodayStatsState] = useState(() => {
    const s   = localStorage.getItem('todayStats');
    const today = new Date().toDateString();
    if (s) {
      const parsed = JSON.parse(s);
      if (parsed.date === today) return parsed;
    }
    return { date: today, steps: 7342, calories: 1680, water: 5, sleep: 7.2, workoutsCompleted: 1, activeMinutes: 42, heartRate: 72, weight: 74.5 };
  });

  const [workouts, setWorkouts] = useState(() => {
    const s = localStorage.getItem('workouts');
    return s ? JSON.parse(s) : defaultWorkouts;
  });

  const [meals, setMeals] = useState(() => {
    const s = localStorage.getItem('meals');
    return s ? JSON.parse(s) : defaultMeals;
  });

  const [sleepLogs, setSleepLogs] = useState(() => {
    const s = localStorage.getItem('sleepLogs');
    return s ? JSON.parse(s) : defaultSleepLogs;
  });

  const [weightLog, setWeightLog] = useState(() => {
    const s = localStorage.getItem('weightLog');
    return s ? JSON.parse(s) : defaultWeightLog;
  });

  const [weeklyData] = useState(generateWeeklyData);

  // Persist to localStorage on every change
  useEffect(() => { localStorage.setItem('fitnessGoals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('todayStats',   JSON.stringify(todayStats)); }, [todayStats]);
  useEffect(() => { localStorage.setItem('workouts',     JSON.stringify(workouts)); }, [workouts]);
  useEffect(() => { localStorage.setItem('meals',        JSON.stringify(meals)); }, [meals]);
  useEffect(() => { localStorage.setItem('sleepLogs',    JSON.stringify(sleepLogs)); }, [sleepLogs]);
  useEffect(() => { localStorage.setItem('weightLog',    JSON.stringify(weightLog)); }, [weightLog]);

  // ── Goals ──────────────────────────────────────────────────────────────────
  const setGoals = (newGoals) => {
    setGoalsState(newGoals);
  };

  // ── Workouts ───────────────────────────────────────────────────────────────
  const addWorkout = (workout) => {
    const newWorkout = { ...workout, id: Date.now(), date: new Date().toDateString() };
    setWorkouts(prev => [newWorkout, ...prev]);
    setTodayStatsState(prev => ({
      ...prev,
      workoutsCompleted: prev.workoutsCompleted + 1,
      activeMinutes:     prev.activeMinutes + workout.duration,
      calories:          prev.calories + workout.calories,
    }));
  };

  // ── Meals ──────────────────────────────────────────────────────────────────
  const addMeal = (meal) => {
    const newMeal = { ...meal, id: Date.now(), date: new Date().toDateString() };
    setMeals(prev => [newMeal, ...prev]);
    setTodayStatsState(prev => ({ ...prev, calories: prev.calories + meal.calories }));
  };

  // ── Sleep ──────────────────────────────────────────────────────────────────
  const addSleepLog = (log) => {
    const newLog = { ...log, id: Date.now(), date: new Date().toDateString() };
    setSleepLogs(prev => [newLog, ...prev]);
    setTodayStatsState(prev => ({ ...prev, sleep: log.duration }));
  };

  // ── Water ──────────────────────────────────────────────────────────────────
  const updateWater = (amount) => {
    setTodayStatsState(prev => ({ ...prev, water: Math.max(0, prev.water + amount) }));
  };

  // ── Steps ──────────────────────────────────────────────────────────────────
  const updateSteps = (steps) => {
    setTodayStatsState(prev => ({ ...prev, steps: Math.max(0, prev.steps + steps) }));
  };

  // ── Weight ─────────────────────────────────────────────────────────────────
  const addWeightEntry = (weight) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry = { date: todayStr, weight };
    setWeightLog(prev =>
      [...prev.filter(e => e.date !== todayStr), newEntry].sort((a, b) => new Date(a.date) - new Date(b.date))
    );
    setTodayStatsState(prev => ({ ...prev, weight }));
  };

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      goals, setGoals,
      todayStats, setTodayStats: setTodayStatsState,
      workouts, addWorkout,
      meals, addMeal,
      sleepLogs, addSleepLog,
      weeklyData,
      weightLog, addWeightEntry,
      updateWater,
      updateSteps,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
