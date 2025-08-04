import { Routes, Route } from 'react-router-dom';

import Layout from "./app/pages/layout/Layout";
import Calendar from "./app/pages/calendar/Calendar";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Calendar/>}></Route>
      </Route>
    </Routes>
  );
}

export default App;
