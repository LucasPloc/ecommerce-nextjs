import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface CartState {
  items: Product[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state: CartState, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    removeFromCart: (
      state: CartState,
      action: PayloadAction<{ id: string }>
    ) => {
      const index = state.items.findIndex(
        (item: Product) => item._id === action.payload.id
      );

      let newBasket = [...state.items];

      if (index >= 0) {
        newBasket.splice(index, 1);
      } else {
        console.log(
          `Cant remove product (id: ${action.payload.id}) as its not in basket!`
        );
      }

      state.items = newBasket;
    },
  },
});
// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartItemById = (state: RootState, id: string) => {
  state.cart.items.filter((item) => item._id === id);
};
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce(
    (acc: number, item: Product) => (acc += item.price),
    0
  );
// Actions
export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
