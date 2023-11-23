import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { instance } from '../utils/axios';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from 'react-query';
import { IShopContext } from '../models/types';
import { Context as ShopContext } from '../context/ShopContext';
import { clearCookie } from '../utils/cookies';

const Navbar = () => {
  const { state, setIsAuthenticated } = useContext<IShopContext>(ShopContext);

  console.log(state.isAuthenticated, 'authenticated');


  const { data } = useQuery(
    'available-money',
    async () => {
      return await instance.get(
        `/users/available-money/${localStorage.getItem('userID')}`
      );
    },
    {
      // staleTime: 5000,
      // refetchOnMount: true,
      refetchOnWindowFocus: true,
      onError: (_error: any) => {
        toast.error("Couldn't fetch available money!", {
          position: toast.POSITION.TOP_CENTER,
        });
      },
    }
  );

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
    clearCookie('access_token');
  };

  console.log('data', data);

  return (
    <div className='navbar'>
      <div className='navbar-title'>
        <h1> DEV-TECH SHOP </h1>
      </div>

      <div className='navbar-links'>
        {!state.isAuthenticated && (
          <>
            <Link to='/'> Shop </Link>
            <Link to='/purchased-items'> Purchases </Link>
            <Link to='/checkout'>
              <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
            <Link to='/auth' onClick={logout}>
              Logout
            </Link>
            <span> $ {data?.data?.availableMoney.toFixed(2)} </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
