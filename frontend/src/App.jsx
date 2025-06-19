import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <div className='max-w-7xl mx-auto min-h-screen'>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App