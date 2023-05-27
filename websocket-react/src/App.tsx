import { Routes, Route } from 'react-router-dom';
import { Client } from './components/Client';
import { Streamer }  from './components/Streamer';
import './App.css';

export const App = () => {
  return (
    <div className="App">
      <h1> Sample Chat </h1>
      <Routes>
        <Route path="/client" element={<Client />} />
        <Route path="/streamer" element={<Streamer />} />
      </Routes>
    </div>
  );
}
