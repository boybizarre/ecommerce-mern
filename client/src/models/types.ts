export interface SignInData {
  email: string;
  password: string;
}

export interface ProductType {
  _id: string;
  productName: string;
  price: number;
  description: string;
  imageURL: string;
  stockQuantity: number;
}

export interface IShopContext {
  // getCartItemCount: (itemId: string) => number;
  addToCart: (itemId: string) => void;
  updateCartItemCount: (newAmount: number, itemId: string) => void;
  // getTotalCartAmount: () => number;
  removeFromCart: (itemId: string) => void;
  // checkout: (customerID: string) => void;
  fetchAvailableMoney: () => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  state: IShopState;
}

export interface IShopState {
  cartItems: any;
  availableMoney: number;
  purchasedItems: ProductType[];
  isAuthenticated: boolean;
}

export interface ShopAction {
  type: string;
  payload?: any;
}
