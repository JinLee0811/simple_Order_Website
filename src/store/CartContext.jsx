import { createContext, useReducer } from "react";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

// state에 값을 직접넣으면 해당 값이 중복으로 들어가게 되어서
// items.findIndex()를 사용하여 중복된 값이 있는지 확인하고 중복된 값이 있으면
// 해당 값의 index를 반환해서 해당 index의 값을 업데이트하도록 한다.

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const existingItemIndex = state.items.findIndex((item) => item.id === action.item.id);

    const updatedItems = [...state.items];

    if (existingItemIndex > -1) {
      const existingItem = state.items[existingItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updatedItems[existingItemIndex] = updatedItem;
    } else {
      updatedItems.push({
        ...action.item,
        quantity: 1,
      });
    }
    return { ...state, items: updatedItems };
  }

  if (action.type === "EMPTY_CART") {
    return { ...state, items: [] };
  }
  if (action.type === "REMOVE_ITEM") {
    const existingItemIndex = state.items.findIndex((item) => item.id === action.id);
    const existingItem = state.items[existingItemIndex];
    const updatedItems = [...state.items];

    if (existingItem.quantity === 1) {
      updatedItems.splice(existingItemIndex, 1);
    } else {
      const updatedItem = { ...existingItem, quantity: existingItem.quantity - 1 };
      updatedItems[existingItemIndex] = updatedItem;
    }

    return { ...state, items: updatedItems };
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({ type: "ADD_ITEM", item });
  }
  function removeItem(id) {
    dispatchCartAction({ type: "REMOVE_ITEM", id });
  }

  function clearCart() {
    dispatchCartAction({ type: "EMPTY_CART" });
  }

  const CartContextValue = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={CartContextValue}>{children}</CartContext.Provider>;
}

export default CartContext;
