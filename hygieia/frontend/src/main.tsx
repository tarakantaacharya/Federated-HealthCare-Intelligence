import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import CentralLogin from './pages/CentralLogin.tsx';
import HospitalLogin from './pages/HospitalLogin.tsx';
import HospitalRegister from './pages/HospitalRegister.tsx';
import HospitalDashboard from './pages/HospitalDashboard.tsx';
import UnderConstruction from './pages/UnderConstruction.tsx';
import UploadPage from './pages/UploadPage.tsx';
import TrainPage from './pages/TrainPage.tsx';
import WeightsPage from './pages/WeightsPage.tsx';
import SendPage from './pages/SendPage.tsx';
import CentralDashboard from './pages/CentralDashboard.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/central-login" element={<CentralLogin />} />
        <Route path="/hospital-login" element={<HospitalLogin />} />
        <Route path="/hospital-register" element={<HospitalRegister />} />
        <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/train" element={<TrainPage />} />
        <Route path="/weights" element={<WeightsPage />} />
        <Route path="/send" element={<SendPage />} />
        <Route path="/central-dashboard" element={<CentralDashboard />} />
        <Route path="/under-construction" element={<UnderConstruction />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
