import { useEffect, useRef, useState } from "react";
import { useWorkoutContext } from "../../context/WorkoutProvider";
import styles from "./RoutineDetail.module.css";

const RoutineDetail = ({ timerProp, isHistory, isActive }) => {
  const { removeTimer, editTimer } = useWorkoutContext();
  const [timer, setTimer] = useState(timerProp);
  const { name, type, targets, rounds, id } = timer;

  const [isEdit, setIsEdit] = useState(false);
  const detailRef = useRef();

  useEffect(() => {
    if (isActive) {
      detailRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isActive]);

  const toggleEdit = () => {
    setIsEdit((prev) => !prev);
    const filtered = targets.filter((target) => target === 0);
    if (isEdit && filtered.length) {
      setTimer(timerProp);
    }
    if (isEdit && !filtered.length) {
      timer.startTimes =
        timer.timerType === "stopwatch"
          ? timer.targets.map(() => 0)
          : timer.targets;
      timer.endTimes =
        timer.timerType === "stopwatch"
          ? timer.targets
          : timer.targets.map(() => 0);
      editTimer(timer.id, timer);
    }
  };

  const handleEdit = (newVal, index) => {
    if (newVal.targets) {
      newVal.targets[index] = newVal.targets[index] * 1000 || 0;
    }
    setTimer((prev) => ({ ...prev, targets: newVal.targets }));
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        borderColor: !isHistory && isActive ? "red" : "white",
      }}
      ref={detailRef}
    >
      <div className={styles.title}>
        {isEdit ? (
          <input
            placeholder="Excercise's name"
            value={name}
            onChange={(e) => handleEdit({ name: e.target.value })}
          ></input>
        ) : (
          <div>{name.toUpperCase()}</div>
        )}
        <div>{type.toUpperCase()}</div>
        <div>
          Rounds:{" "}
          {isEdit ? (
            <input
              placeholder="rounds"
              value={rounds}
              onChange={(e) => handleEdit({ rounds: e.target.value })}
            />
          ) : (
            <span>{rounds}</span>
          )}
        </div>
      </div>
      <div>
        {targets.map((target, index) =>
          isEdit ? (
            <input
              value={target / 1000}
              key={`${timer.id}_${index}`}
              onChange={(e) =>
                handleEdit(
                  {
                    targets: [
                      ...targets.slice(0, index),
                      e.target.value,
                      ...targets.slice(index + 1),
                    ],
                  },
                  index
                )
              }
            />
          ) : (
            <div key={`${timer.id}_${index}`}>{`${target / 1000}s`}</div>
          )
        )}
      </div>
      {!isHistory && (
        <>
          <div className={styles.closeBtn} onClick={() => removeTimer(id)}>
            X
          </div>
          <div onClick={toggleEdit}>{isEdit ? "Save" : "Edit"}</div>
        </>
      )}
    </div>
  );
};

export default RoutineDetail;
