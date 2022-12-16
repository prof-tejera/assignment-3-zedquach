import { useWorkoutContext } from "../../context/WorkoutProvider";
import RoutineDetail from "./RoutineDetail";
import styles from "./RoutineList.module.css";

const RoutineList = ({ timersProp, isHistory = false }) => {
  const { timers: timersContext, currentIndex } = useWorkoutContext();

  const timers = timersProp || timersContext;

  return (
    <div className={styles.wrapper}>
      {timers.map((timer, index) => (
        <RoutineDetail
          timerProp={timer}
          key={timer.id}
          isHistory={isHistory}
          isActive={timers[currentIndex].id === timer.id}
        />
      ))}
    </div>
  );
};

export default RoutineList;
