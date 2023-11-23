import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context as ShopContext } from '../../context/ShopContext';
import { ProductType, IShopContext } from '../../models/types';
import useGetProducts from '../../hooks/useGetProducts';
import CartItem from '../../components/CartItem';
import { instance } from '../../utils/axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import './styles.css';

const CheckoutPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { fetchedProducts } = useGetProducts();

  const { state } = useContext<IShopContext>(ShopContext);

  // const totalPrice = () => {
  //   let totalAmount = 0;
  //   for (const item in state.cartItems) {
  //     if (state.cartItems[item] > 0) {
  //       let itemInfo: ProductType = fetchedProducts?.data?.products.find(
  //         (product: ProductType) => product._id === item
  //       );

  //       totalAmount += state.cartItems[item] * itemInfo.price;
  //     }
  //   }

  //   return totalAmount.toFixed(2);
  // };

  const totalPrice = () => {
    let totalAmount = 0;
    const productMap = new Map(
      fetchedProducts?.data?.products.map((product: ProductType) => [
        product._id,
        product,
      ])
    );

    for (const itemId in state.cartItems) {
      if (state.cartItems[itemId] > 0) {
        const itemInfo = productMap.get(itemId) as ProductType | undefined;

        // type guard just for extra safety
        if (itemInfo && typeof itemInfo === 'object' && 'price' in itemInfo) {
          totalAmount += state.cartItems[itemId] * itemInfo.price;
        }
      }
    }

    return totalAmount.toFixed(2);
  };

  const { cartItems } = state;
  const body = { customerID: localStorage.getItem('userID'), cartItems };

  const { mutate: checkout } = useMutation(
    async () => {
      return await instance.post('/products/checkout', body);
    },
    {
      onSuccess: async () => {
        toast.success('Checkout complete');

        await queryClient.invalidateQueries('available-money');
        navigate('/');
      },
      onError: (_error: any) => {
        toast.error('Something went wrong. Try again later');
      },
    }
  );

  const handleCheckout = () => {
    checkout();
  };

  console.log(state);

  return (
    <div className='cart'>
      <h1> Your Cart Items </h1>
      <div className='cart'>
        {fetchedProducts?.data?.products?.map((product: ProductType) => {
          if (
            product._id in state.cartItems &&
            state.cartItems[product._id] !== 0
          ) {
            return <CartItem key={product._id} product={product} />;
          }
          return null;
        })}
      </div>
      {Number(totalPrice()) > 0 ? (
        <div className='checkout'>
          <p>Subtotal: ${totalPrice()}</p>
          <button onClick={() => navigate('/')}> Continue Shopping </button>
          <button onClick={handleCheckout}> Checkout </button>
        </div>
      ) : (
        <h1>Your Shopping Cart is Empty</h1>
      )}
    </div>
  );
};

export default CheckoutPage;
