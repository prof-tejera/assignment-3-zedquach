import RoutineList from "../components/routine/RoutineList";
import Clock from "../components/display/Clock";
import styles from "./Home.module.css";
import { decode } from "../lib/hash";

import { useWorkoutContext } from "../context/WorkoutProvider";
import { useSearchParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/error";

let didInit = false;

const Home = (props) => {
  const {
    timers,
    setTimers,
    toggleRunPause,
    nextTimer,
    reset,
    currentTime,
    isDone,
  } = useWorkoutContext();

  const [searchParams, setSearchParams] = useSearchParams();

  if (!didInit) {
    const routineId = searchParams.get("routine");
    didInit = true;
    if (routineId) {
      decode(routineId).then((res) => setTimers(JSON.parse(res)));
    }
  }

  return (
    <div className={styles.wrapper}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <RoutineList />
      </ErrorBoundary>
      {timers.length > 0 && (
        <div>
          Total Time:
          {` ${
            timers.reduce(
              (total, timer) =>
                total +
                timer.targets.reduce(
                  (timerTotal, time) => timerTotal + time * timer.rounds,
                  0
                ),
              0
            ) / 1000
          }`}
          s
        </div>
      )}
      <div>
        <button
          onClick={toggleRunPause}
          disabled={timers.length === 0 || isDone}
        >
          Start/Pause
        </button>
        <button onClick={reset} disabled={timers.length === 0}>
          Reset
        </button>
        <button onClick={nextTimer} disabled={timers.length === 0 || isDone}>
          Next
        </button>
      </div>
      <div>
        <Clock time={currentTime} />
      </div>
    </div>
  );
};

export default Home;
