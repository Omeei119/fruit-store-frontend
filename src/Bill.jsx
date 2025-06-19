import React from "react";

function Cart({ cartItems, onRemoveFromCart, onUpdateCartItem }) {
  const handleIncreaseQuantity = (productId) => {
    const updatedQty = cartItems.find((item) => item.id === productId).qty + 1;
    onUpdateCartItem(productId, updatedQty);
  };

  const handleDecreaseQuantity = (productId) => {
    const updatedQty = cartItems.find((item) => item.id === productId).qty - 1;
    if (updatedQty >= 0) {
      onUpdateCartItem(productId, updatedQty);
    }
  };

  const handleRemove = (productId) => {
    onRemoveFromCart(productId);
  };

  // Calculating total and tax
  const total = cartItems.reduce((total, item) => total + item.mrp * item.qty, 0);
  const tax = total * 0.05; // 5% GST example
  const grandTotal = total + tax;

  return (
    <div className="cart">
      <h3>Billing Section</h3>
      
      <div className="billing-details">
        <label>Customer Name:</label>
        <input type="text" name="customerName" placeholder="Enter customer name" />
      </div>

      <ul>
        {cartItems.map((item) => (
          <li key={item.id} className="cart-item">
            <div className="cart-item-info">
              <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px" }} />
              <div>
                <p>{item.name} ({item.qty} {item.unit})</p>
                <p>Price: ₹{item.mrp}</p>
              </div>
            </div>
            <div className="cart-item-actions">
              <button onClick={() => handleDecreaseQuantity(item.id)} className="quantity-button">
                -
              </button>
              <button onClick={() => handleIncreaseQuantity(item.id)} className="quantity-button">
                +
              </button>
              <button onClick={() => handleRemove(item.id)} className="remove-button">
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-total">
        <p>Subtotal: ₹{total.toFixed(2)}</p>
        <p>Tax (5% GST): ₹{tax.toFixed(2)}</p>
        <strong>Grand Total: ₹{grandTotal.toFixed(2)}</strong>
      </div>

      <button className="generate-bill-button">Generate Bill</button>
    </div>
  );
}

export default Cart;
