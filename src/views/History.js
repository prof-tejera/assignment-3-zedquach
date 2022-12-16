import RoutineList from "../components/routine/RoutineList";

const History = () => {
  const routines = JSON.parse(localStorage.getItem("history")) || [];
  return (
    <div>
      {routines.map((routine, index) => (
        <RoutineList timersProp={routine} key={index} isHistory={true} />
      ))}
    </div>
  );
};

export default History;
