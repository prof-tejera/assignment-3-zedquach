import styles from "./Clock.module.css";

const Clock = ({ time }) => {
  return (
    <div className={styles.panel}>
      <div className={styles.clock}>
        {new Date(time).toISOString().substring(11, 21)}
      </div>
      <div className={styles.progress} />
      <div className={styles.roundMask}></div>
      <div className={styles.round}></div>
    </div>
  );
};

export default Clock;
