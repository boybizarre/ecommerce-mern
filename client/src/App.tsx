// import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { Navigate } from 'react-router-dom';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

// components
import Navbar from './components/Navbar';
import PageNotFound from './components/PageNotFound';

// pages
import AuthPage from './pages/auth';
import CheckoutPage from './pages/checkout';
import ShopPage from './pages/shop';
import PurchasedItemsPage from './pages/purchased-items';

// context
import { Provider as ShopProvider } from './context/ShopContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='App'>
        <Router>
          <ShopProvider>
            <Navbar />
            <Routes>
              <Route path='/' element={<ShopPage />} />
              <Route path='/auth' element={<AuthPage />} />
              <Route path='/checkout' element={<CheckoutPage />} />
              <Route path='/purchased-items' element={<PurchasedItemsPage />} />
              <Route path='*' element={<PageNotFound />} />
            </Routes>
            <ToastContainer position='top-center' />
          </ShopProvider>
        </Router>
      </div>
    </QueryClientProvider>
  );
}

export default App;
