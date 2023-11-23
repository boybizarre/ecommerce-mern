import { ProductType } from '../models/types';
import { useContext } from 'react';
import { Context as ShopContext } from '../context/ShopContext';
import { IShopContext } from '../models/types';

interface ProductProps {
  product: ProductType;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const { _id, productName, description, price, stockQuantity, imageURL } =
    product;

  const { state, addToCart } = useContext<IShopContext>(ShopContext);

  console.log(state.cartItems);

  return (
    <div className='product'>
      <img src={imageURL} />
      <div className='description'>
        <h3> {productName} </h3>
        <p> {description} </p>
        <p> {price} </p>
      </div>
      <button className='addToCartBttn' onClick={() => addToCart(_id)}>
        Add To Cart{' '}
        {product._id in state.cartItems &&
          state.cartItems[product._id] !== 0 && (
            <> ({state.cartItems[product._id]}) </>
          )}
      </button>
      <div className='stock-quantity'>
        {stockQuantity === 0 && <h1> OUT OF STOCK </h1>}
      </div>
    </div>
  );
};

export default Product;
