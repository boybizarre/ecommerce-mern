import { useContext } from 'react';
import { Context as ShopContext } from '../../context/ShopContext';
import useGetPurchasedItems from '../../hooks/useGetPurchasedItems';
import { IShopContext, ProductType } from '../../models/types';

import './styles.css';

const PurchasedItemsPage = () => {
  const { purchasedItems } = useGetPurchasedItems();

  const { state, addToCart } = useContext<IShopContext>(ShopContext);

  return (
    <div className='purchased-items-page'>
      <h1> Previously Purchased Items </h1>
      <div className='purchased-items'>
        {purchasedItems?.data?.purchasedItems?.map((item: ProductType) => {
          return (
            <div key={item._id} className='item'>
              <h3>{item.productName} </h3>
              <img src={item.imageURL} />
              <p> ${item.price} </p>
              <button
                onClick={() => addToCart(item._id)}
              >
                Purchase Again
                {item._id in state.cartItems &&
                  state.cartItems[item._id] !== 0 && (
                    <> ({state.cartItems[item._id]}) </>
                  )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PurchasedItemsPage;
