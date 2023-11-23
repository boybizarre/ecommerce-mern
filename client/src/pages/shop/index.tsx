import { useContext } from 'react';
import useGetProducts from '../../hooks/useGetProducts';
import { IShopContext, ProductType } from '../../models/types';
import { Context as ShopContext } from '../../context/ShopContext';
import { getCookie } from '../../utils/cookies';

import './styles.css';

// components
import Product from '../../components/Product';
import { Navigate } from 'react-router-dom';

const ShopPage = () => {
  const { state } = useContext<IShopContext>(ShopContext);

  const { fetchedProducts } = useGetProducts();

  // console.log(fetchedProducts?.data?.products, 'fetchedProducts');

  // LOOK here
  // if (!state.isAuthenticated) {
  //   return <Navigate to='/auth' />;
  // }

  return (
    <div className='shop'>
      <div className='products'>
        {fetchedProducts?.data?.products?.map((product: ProductType) => (
          <Product product={product} key={product._id} />
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
