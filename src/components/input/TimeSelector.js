import styles from "./TimeSelector.module.css";
import Input from "./Input";
import { useEffect, useState } from "react";

const TimeSelector = ({ setTime, label }) => {
  const [inputTime, setInputTime] = useState({ hour: 0, minute: 0, second: 0 });

  const setTimeKey = (key, val) => {
    setInputTime((prev) => ({ ...prev, [key]: val }));
  };

  useEffect(() => {
    setTime(
      (inputTime.hour * 60 + inputTime.minute * 60 + inputTime.second) * 1000
    );
  }, [inputTime, setTime]);

  return (
    <div className={styles.timeInputWrapper}>
      <div className={styles.timeInputLabel}>{label}</div>
      <div className={styles.inputGroup}>
        <Input maxChoice={24} setTime={(val) => setTimeKey("hour", val)} />
        <Input maxChoice={60} setTime={(val) => setTimeKey("minute", val)} />
        <Input maxChoice={60} setTime={(val) => setTimeKey("second", val)} />
      </div>
    </div>
  );
};

export default TimeSelector;
