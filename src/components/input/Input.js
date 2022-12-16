import styles from "./Input.module.css";
import { useEffect, useRef } from "react";

const Input = ({ maxChoice, setTime }) => {
  const inputRef = useRef();

  const range = [...Array(maxChoice).keys()]
    .map((num) => `0${num}`.slice(-2))
    .map((num) => (
      <div key={num} className={styles.inputText}>
        {num}
      </div>
    ));

  useEffect(() => {
    let scrollTimer;
    let inputNode = inputRef.current;
    const handleScroll = () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(() => {
        for (const element of inputRef.current.children) {
          if (
            Math.abs(
              (element.getBoundingClientRect().top +
                element.getBoundingClientRect().bottom) /
                2 -
                (inputRef.current.getBoundingClientRect().top +
                  inputRef.current.getBoundingClientRect().bottom) /
                  2
            ) <= 20
          ) {
            setTime(parseInt(element.innerHTML));
          }
        }
      }, 10);
    };
    if (inputRef && inputRef.current) {
      inputNode.addEventListener("scroll", handleScroll);
    }
    return () => inputNode.removeEventListener("scroll", handleScroll);
  }, [setTime]);

  return (
    <div className={styles.inputWrapper}>
      <div className={styles.marker} />
      <div className={styles.mask} />
      <div className={styles.input} ref={inputRef}>
        {range}
      </div>
    </div>
  );
};

export default Input;
