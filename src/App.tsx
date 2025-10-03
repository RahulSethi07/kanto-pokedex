import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ListView from './components/ListView/ListView';
import GalleryView from './components/GalleryView/GalleryView';
import DetailView from './components/DetailView/DetailView';
import NotFound from './components/Common/NotFound';
import { PokemonProvider } from './context/PokemonContext';
import './App.css';

const App: React.FC = () => (
  <BrowserRouter basename="/mp2">
    <PokemonProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/list" replace />} />
          <Route path="/list" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/pokemon/:id" element={<DetailView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </PokemonProvider>
  </BrowserRouter>
);

export default App;
