import { useWorkoutContext } from "../../context/WorkoutProvider";
import RoutineDetail from "./RoutineDetail";
import styles from "./RoutineList.module.css";

const RoutineList = ({ timersProp, isHistory = false }) => {
  const { timers: timersContext } = useWorkoutContext();

  const timers = timersProp || timersContext;

  return (
    <div className={styles.wrapper}>
      {timers.map((timer, index) => (
        <RoutineDetail
          {...timer}
          index={index}
          key={index}
          isHistory={isHistory}
        />
      ))}
    </div>
  );
};

export default RoutineList;
