// src/App.jsx
import './App.css';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';

export default function App(){
  return (
    <>
      <Header />
      <main className="app-main">
        <div className="container">
          <Outlet /> {/* her render routes-indholdet, fx Dashboard */}
        </div>
      </main>
    </>
  );
}
