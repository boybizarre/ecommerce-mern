import createDataContext from './createDataContext';
import { IShopState, ShopAction } from '../models/types';
// import { instance } from '../utils/axios';

const shopReducer = (state: IShopState, action: ShopAction) => {
  let itemId;
  switch (action.type) {
    case 'ADD_TO_CART':
      itemId = action.payload;

      // if (!state.cartItems[itemId]) {
      //   // If the item is not in the cart, add it with a quantity of 1
      //   return {
      //     ...state,
      //     cartItems: {
      //       ...state.cartItems,
      //       [itemId]: 1,
      //     },
      //   };
      // } else {
      //   // If the item is already in the cart, increment the quantity by 1
      //   return {
      //     ...state,
      //     cartItems: {
      //       ...state.cartItems,
      //       [itemId]: state.cartItems[itemId] + 1,
      //     },
      //   };
      // }

      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [itemId]: (state.cartItems[itemId] || 0) + 1,
        },
      };

    case 'REMOVE_FROM_CART':
      itemId = action.payload;
      if (!state.cartItems[itemId]) return { ...state };

      if (state.cartItems[itemId] === 1) {
        const newObj = { ...state.cartItems };
        delete newObj[itemId];

        return {
          ...state,
          cartItems: {
            ...newObj,
          },
        };
      }

      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [itemId]: state.cartItems[itemId] - 1,
        },
      };

    case 'UPDATE_CART':
      const { newAmount } = action.payload;
      itemId = action.payload.itemId;
      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [itemId]: newAmount,
        },
      };

    case 'SET_AUTHENTICATION':
      return { ...state, isAuthenticated: action.payload };
    default:
      return state;
  }
};

const addToCart = (dispatch: React.Dispatch<any>) => (itemId: string) => {
  dispatch({ type: 'ADD_TO_CART', payload: itemId });
};

const removeFromCart = (dispatch: React.Dispatch<any>) => (itemId: string) => {
  dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
};

const updateCartItemCount =
  (dispatch: React.Dispatch<any>) => (newAmount: number, itemId: string) => {
    if (newAmount < 0) return;
    dispatch({ type: 'UPDATE_CART', payload: { newAmount, itemId } });
  };

const setIsAuthenticated =
  (dispatch: React.Dispatch<any>) => (booleanVal: boolean) => {
    dispatch({ type: 'SET_AUTHENTICATION', payload: booleanVal });
  };

export const { Provider, Context } = createDataContext(
  shopReducer,
  { addToCart, removeFromCart, updateCartItemCount, setIsAuthenticated },
  {
    cartItems: {},
    availableMoney: 0,
    purchasedItems: [],
    isAuthenticated: null,
  }
);
