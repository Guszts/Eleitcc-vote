import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Candidatar } from './pages/Candidacy';
import { Votar } from './pages/Voting';
import { Ajustes } from './pages/Settings';
import { AdminPanel } from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/candidatar" element={<Candidatar />} />
          <Route path="/votar" element={<Votar />} />
          <Route path="/ajustes" element={<Ajustes />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
