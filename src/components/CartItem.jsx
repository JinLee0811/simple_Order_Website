import { currencyFormatter } from "../utils/formatting";

export default function CartItem({ name, quantity, price, increase, decrease }) {
  return (
    <li className="cart-item">
      <p>
        {name} - {quantity} x {currencyFormatter.format(price)}
      </p>
      <p className="cart-item-actions">
        <button onClick={decrease}>-</button>
        <span>{quantity}</span>
        <button onClick={increase}>+</button>
      </p>
    </li>
  );
}
