import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import Home from "./views/Home";
import { useSearchParams } from "react-router-dom";
import { encode } from "./lib/hash";
import { useWorkoutContext } from "./context/WorkoutProvider";
import History from "./views/History";
import AddTimer from "./views/AddTimer";

const Container = styled.div`
  background: #060126;
  height: 100vh;
  width: 100vw;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`;

const Nav = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let newRoutineParams = new URLSearchParams();
  const { search } = useLocation();

  const { timers } = useWorkoutContext();

  const [prevTimers, setPrevTimers] = useState(timers);

  // Update url when timers change
  if (timers !== prevTimers) {
    encode(JSON.stringify(timers)).then((encodedString) => {
      newRoutineParams.set("routine", encodedString);
      setPrevTimers(timers);
      setSearchParams(newRoutineParams);
    });
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to={"/" + search}>Home</Link>
        </li>
        <li>
          <Link to={"/add" + search}>Add</Link>
        </li>
        <li>
          <Link to={"/history"}>History</Link>
        </li>
      </ul>
    </nav>
  );
};

const App = () => {
  return (
    <Container>
      <Router basename="/assignment-2-zedquach">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/add" element={<AddTimer />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
