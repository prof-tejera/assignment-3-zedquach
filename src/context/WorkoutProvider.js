import { createContext, useContext, useRef, useState } from "react";
const WorkoutContext = createContext();

let didInit = false;

const root = document.querySelector(":root");

const WorkoutProvider = ({ children }) => {
  const [timers, setTimers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // holds setInterval's ID for clearInterval and checking if routine is running
  const intervalRef = useRef();
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTarget, setCurrentTarget] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const [prevOffset, setPrevOffset] = useState(-10);

  const saveState = () => {
    localStorage.setItem(
      "routineState",
      JSON.stringify({
        currentTime,
        currentRound,
        currentTarget,
        currentIndex,
        isDone,
      })
    );
  };

  if (!didInit) {
    window.onbeforeunload = saveState;
  }

  //Add new timer to workout routine
  const addTimer = (newTimer) => {
    setTimers((prev) => [...prev, newTimer]);
    reset();
  };

  // Remove timer from workout routine
  const removeTimer = (id) => {
    const newTimers = [...timers].filter((timer) => timer.id !== id);
    setTimers(newTimers);
    reset();
  };

  const editTimer = (id, newTimer) => {
    const newTimers = [...timers].map((timer) =>
      timer.id === id ? newTimer : timer
    );
    setTimers(newTimers);
    reset();
  };

  const restoreTimers = (newTimers) => {
    stop();
    if (!newTimers.length) {
      return;
    }
    const state = JSON.parse(localStorage.getItem("routineState"));
    setPrevOffset(newTimers[0].offset);
    setTimers(newTimers);

    // if value exists that mean we have saved state since we delete it when timers change
    // We can technically save a state for each of the timers state by using hash as key
    // But that may create too many keys in the storage so we will just set the last one
    if (state) {
      setCurrentIndex(state.currentIndex);
      setCurrentRound(state.currentRound);
      setCurrentTarget(state.currentTarget);
      setCurrentTime(state.currentTime);
      setIsDone(state.isDone);
    } else {
      setCurrentTime(newTimers[0].startTimes[0]);
    }
  };

  // Start timer
  const start = () => {
    // Avoid duplicate setInterval
    stop();
    setIsDone(false);
    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => prev + timers[currentIndex].offset);
    }, 10);
  };

  // Stop timer
  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const toggleRunPause = () => {
    if (intervalRef.current) {
      stop();
    } else {
      start();
    }
  };

  const nextTimer = () => {
    if (currentIndex < timers.length - 1) {
      setCurrentTarget(0);
      setCurrentRound(1);
      setCurrentIndex((prev) => prev + 1);
      setCurrentTime(timers[currentIndex + 1].startTimes[0]);
    } else {
      setIsDone(true);
      stop();
      const history = JSON.parse(localStorage.getItem("history")) || [];
      history.push(timers);
      localStorage.setItem("history", JSON.stringify(history));
    }
  };

  // Move to next target/round/timer base on where we are
  const next = () => {
    if (currentTarget < timers[currentIndex].targets.length - 1) {
      setCurrentTarget((prev) => prev + 1);
      setCurrentTime(timers[currentIndex].startTimes[currentTarget + 1]);
    } else if (currentRound < timers[currentIndex].rounds) {
      setCurrentTarget(0);
      setCurrentRound((prev) => prev + 1);
      setCurrentTime(timers[currentIndex].startTimes[0]);
    } else {
      nextTimer();
    }
  };

  const reset = () => {
    stop();
    setCurrentTarget(0);
    setCurrentRound(1);
    setCurrentIndex(0);
    root.style.setProperty("--progress-deg", `0deg`);
    setCurrentTime(timers[0]?.startTimes[0] || 0);
    setIsDone(false);
  };

  if (intervalRef.current) {
    root.style.setProperty(
      "--progress-deg",
      `${
        ((currentTime + timers[currentIndex].offset) /
          timers[currentIndex].targets[currentTarget]) *
          360 || 0
      }deg`
    );
    // Check if offset changed. If yes we restart the interval to update the offset in interval
    if (prevOffset !== timers[currentIndex].offset) {
      setPrevOffset(timers[currentIndex].offset);
      start();
    } else if (currentTime === timers[currentIndex].endTimes[currentTarget]) {
      next();
    }
  }

  return (
    <WorkoutContext.Provider
      value={{
        timers,
        currentTime,
        currentIndex,
        setTimers: restoreTimers,
        addTimer,
        removeTimer,
        editTimer,
        toggleRunPause,
        nextTimer,
        reset,
        isDone,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

const useWorkoutContext = () => useContext(WorkoutContext);

export { WorkoutProvider, useWorkoutContext };
