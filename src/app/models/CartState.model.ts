import { CartItem } from './CartItem.model';

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

export const initialCartState: CartState = {
  items: [],
  loading: false,
  error: null
};

