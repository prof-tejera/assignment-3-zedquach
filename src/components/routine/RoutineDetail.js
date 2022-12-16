import { useEffect, useRef, useState } from "react";
import { useWorkoutContext } from "../../context/WorkoutProvider";
import styles from "./RoutineDetail.module.css";

const RoutineDetail = ({ name, type, targets, index, rounds, isHistory }) => {
  const { currentIndex, removeTimer } = useWorkoutContext();
  const [isEdit, setIsEdit] = useState(false);
  const detailRef = useRef();

  useEffect(() => {
    if (currentIndex && currentIndex === index) {
      detailRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentIndex, index]);

  const toggleEdit = () => {
    setIsEdit((prev) => !prev);
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        borderColor: !isHistory && index === currentIndex ? "red" : "white",
      }}
      ref={detailRef}
    >
      <div className={styles.title}>
        {isEdit ? (
          <input placeholder="Excercise's name"></input>
        ) : (
          <div>{name.toUpperCase()}</div>
        )}
        <div>{type.toUpperCase()}</div>
        <div>
          Rounds: <span>{rounds}</span>
        </div>
      </div>
      <div>
        {targets.map((target, index) => (
          <div key={index}>{`${target / 1000}`}</div>
        ))}
      </div>
      {!isHistory && (
        <>
          <div className={styles.closeBtn} onClick={() => removeTimer(index)}>
            X
          </div>
          <div onClick={toggleEdit}>{isEdit ? "Save" : "Edit"}</div>
        </>
      )}
    </div>
  );
};

export default RoutineDetail;
