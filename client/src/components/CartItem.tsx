import React, { useContext } from 'react';
import { ProductType } from '../models/types';
import { Context as ShopContext } from '../context/ShopContext';
import { IShopContext } from '../models/types';

interface CartItemProps {
  product: ProductType;
}

const CartItem: React.FC<CartItemProps> = ({ product }) => {
  const { _id, productName, price, imageURL } = product;

  const { state, addToCart, removeFromCart, updateCartItemCount } =
    useContext<IShopContext>(ShopContext);

  return (
    <div className='cart-item'>
      <img src={imageURL} />
      <div className='description'>
        <h3> {productName} </h3>
        <p> Price: ${price} </p>
      </div>

      <div className='count-handler'>
        <button onClick={() => removeFromCart(_id)}> - </button>
        <input
          type='number'
          value={state.cartItems[_id]}
          onChange={(e) => updateCartItemCount(Number(e.target.value), _id)}
        />
        <button onClick={() => addToCart(_id)}> + </button>
      </div>
    </div>
  );
};

export default CartItem;
