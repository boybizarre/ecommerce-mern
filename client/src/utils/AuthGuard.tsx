import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// context
import { Context as ShopContext } from '../context/ShopContext';
// utils
import { clearCookie } from './cookies';
// types
import { IShopContext } from '../models/types';
// components
import AuthPage from '../pages/auth';

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { state } = useContext<IShopContext>(ShopContext);

  // const { pathname } = useLocation();
  // const [requestedLocation, setRequestedLocation] = useState(null);

  if (!state.isAuthenticated) {
    // if (pathname !== requestedLocation) {
    //   setRequestedLocation(pathname);
    // }

    localStorage.clear();
    clearCookie('access_token');

    return <AuthPage />;
  }

  // if (!isInitialized) {
  //   return <LoadingScreen />;
  // }

  // if (requestedLocation && pathname !== requestedLocation) {
  //   setRequestedLocation(null);
  //   return <Navigate to={requestedLocation} />;
  // }

  // if (pathname === '/auth/login') {
  //   return <Navigate to={'/dashboard/app'} />;
  // }

  return <>{children}</>;
}
