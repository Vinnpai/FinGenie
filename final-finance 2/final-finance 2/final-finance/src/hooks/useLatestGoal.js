import { useEffect, useState } from 'react';

export function useLatestGoal() {
  const [latestGoal, setLatestGoal] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('latest_goal');
      setLatestGoal(raw ? JSON.parse(raw) : null);
    } catch {
      setLatestGoal(null);
    }
  }, []);

  const updateLatestGoal = (goalObj) => {
    try {
      localStorage.setItem('latest_goal', JSON.stringify(goalObj));
      setLatestGoal(goalObj);
    } catch {}
  };

  const clearLatestGoal = () => {
    try {
      localStorage.removeItem('latest_goal');
    } catch {}
    setLatestGoal(null);
  };

  return { latestGoal, updateLatestGoal, clearLatestGoal };
}
