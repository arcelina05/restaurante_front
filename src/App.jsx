import { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'; 
import './App.css';

import AdminHome from './components/AdminHome';
import CocinaHome from './components/CocinaHome';
import MeseroHome from './components/MeseroHome';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  return (  
    <BrowserRouter>
      <Routes>
        <Route index element={<Login callback={setUser}/>}></Route>
        <Route path='/adminHome' element={<AdminHome user={user}/>}></Route>
        <Route path='/meseroHome' element={<MeseroHome user={user}/>}></Route>
        <Route path='/cocinaHome' element={<CocinaHome user={user}/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
