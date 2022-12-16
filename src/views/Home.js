import RoutineList from "../components/routine/RoutineList";
import Clock from "../components/display/Clock";
import styles from "./Home.module.css";
import { decode } from "../lib/hash";

import { useWorkoutContext } from "../context/WorkoutProvider";
import { useSearchParams } from "react-router-dom";

let didInit = false;

const Home = (props) => {
  const { timers, setTimers, toggleRunPause, nextTimer, reset, currentTime } =
    useWorkoutContext();

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
      <RoutineList />
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
        <button onClick={toggleRunPause}>Start/Pause</button>
        <button onClick={reset} disabled={timers.length === 0}>
          Reset
        </button>
        <button onClick={nextTimer} disabled={timers.length === 0}>
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
