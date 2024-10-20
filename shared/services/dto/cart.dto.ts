import { Cart, CartItem, Ingredient, Product, ProductItem } from '@prisma/client';

export type CartItemDTO = CartItem & {
  productItem: ProductItem & {
    product: Product;
  };
  ingredients: Ingredient[];
};

export interface CartDTO extends Cart {
  items: CartItemDTO[];
}

// type and size - не нужен, пошта есть продуктайтемид
// quantity - для фронта не будет идти (тип)
export interface CreateCartItemValues {
  productItemId: number;
  ingredients?: number[];
}
