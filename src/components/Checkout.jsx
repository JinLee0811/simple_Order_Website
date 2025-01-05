import { useContext } from "react";
import CartContext from "../store/CartContext";
import Modal from "./Modal";
import { currencyFormatter } from "../utils/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const useProgressCtx = useContext(UserProgressContext);
  const cartTotal = cartCtx.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("http://localhost:3000/orders", requestConfig);

  function handleCloseCheckout() {
    useProgressCtx.hideCheckout();
  }
  function handleCloseConfirm() {
    useProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }

  let actions = (
    <>
      <Button textOnly type="button" onClick={handleCloseCheckout}>
        Cancel
      </Button>
      <Button>Confirm</Button>
    </>
  );

  if (isSending) {
    actions = <span>Your Order is sending...</span>;
  }

  if (data && !error) {
    return (
      <Modal open={useProgressCtx.progress === "checkout"} onClose={handleCloseConfirm}>
        <div>
          <h2>Order completed</h2>
          <p>your order has complated, we will send bill via Email.</p>
        </div>
        <p className="modal-actions">
          <Button textOnly type="button" onClick={handleCloseConfirm}>
            Confirm
          </Button>
        </p>
      </Modal>
    );
  }

  return (
    <>
      <Modal open={useProgressCtx.progress === "checkout"} onClose={handleCloseCheckout}>
        <form onSubmit={handleSubmit}>
          <h2>Checkout</h2>
          <p>Total Amount: {currencyFormatter.format(cartTotal)} </p>
          <Input label="Full Name" type="text" id="name" />
          <Input label="E-Mail Adress" type="email" id="email" />
          <Input label="Street" type="text" id="street" />
          <div className="control-row">
            <Input label="City" type="text" id="city" />
            <Input label="Postal Code" type="text" id="postal-code" />
          </div>
          {error && <Error title="An error occurred!" message={error} />}
          <p className="modal-actions">{actions}</p>
        </form>
      </Modal>
    </>
  );
}
