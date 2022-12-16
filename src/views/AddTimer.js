import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import TimeSelector from "../components/input/TimeSelector";
import { useWorkoutContext } from "../context/WorkoutProvider";
import { decode } from "../lib/hash";
import styles from "./AddTimer.module.css";

let didInit = false;

const Timer = () => {
  const { addTimer, setTimers } = useWorkoutContext();
  const [name, setName] = useState("");
  const [rounds, setRounds] = useState("");
  const [timerType, setTimerType] = useState("stopwatch");
  const [targetTime, setTargetTime] = useState([0, 0]);
  const [message, setMessage] = useState({ message: "", type: "" });

  const [searchParams, setSearchParams] = useSearchParams();

  if (!didInit) {
    const routineId = searchParams.get("routine");
    didInit = true;
    if (routineId) {
      decode(routineId).then((res) => setTimers(JSON.parse(res)));
    }
  }

  const handleAdd = () => {
    // Get raw value instead of state
    const targets =
      timerType === "tabata" ? targetTime : targetTime.slice(0, 1);

    if (targets.includes(0)) {
      setMessage({
        message: "Some of the target is 0. Please set all the target!",
        type: "error",
      });
      return;
    }

    if (name.length === 0) {
      setMessage({ message: "Please enter excercise's name!", type: "error" });
      return;
    }

    const startTimes =
      timerType === "stopwatch" ? targets.map(() => 0) : targets;
    const endTimes = timerType === "stopwatch" ? targets : targets.map(() => 0);

    const newTimer = JSON.parse(
      JSON.stringify({
        id: Date.now(),
        name,
        type: timerType,
        targets,
        startTimes,
        endTimes,
        offset: timerType === "stopwatch" ? 10 : -10,
        rounds: parseInt(rounds) || 1,
      })
    );

    addTimer(newTimer);
    setMessage({ message: "Timer added!", type: "confirm" });
  };

  const handleChangeType = (e) => {
    setTimerType(e.target.value);
  };

  const handleSetTarget = (index, time) => {
    setTargetTime((prev) => {
      prev[index] = time;
      return prev;
    });
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleRoundChange = (e) => {
    setRounds(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <div>{message.message}</div>
        <select id="timerType" onChange={handleChangeType}>
          <option value="stopwatch">Stop Watch</option>
          <option value="countdown">Count down</option>
          <option value="xy">XY</option>
          <option value="tabata">TABATA</option>
        </select>

        <input
          placeholder="Excercise's name"
          value={name}
          onChange={handleChangeName}
        />
        {["xy", "tabata"].includes(timerType) && (
          <input
            placeholder="Number of rounds"
            value={rounds}
            onChange={handleRoundChange}
          />
        )}

        <button onClick={handleAdd}>Add Timer</button>
      </div>

      <div className={styles.timeWrapper}>
        {timerType !== "tabata" ? (
          <TimeSelector
            setTime={(time) => handleSetTarget(0, time)}
            label={`Target Time`}
          />
        ) : (
          <>
            <TimeSelector
              setTime={(time) => handleSetTarget(0, time)}
              label={`Work time`}
              key={0}
            />
            <TimeSelector
              setTime={(time) => handleSetTarget(1, time)}
              label={`Rest Time`}
              key={1}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Timer;
