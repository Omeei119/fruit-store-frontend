import React from "react";
import jsPDF from "jspdf"; // Add jsPDF library for PDF generation

function Cart({ cartItems, onRemoveFromCart, onUpdateCartItem, loggedInUser }) {
  const customerName = loggedInUser?.name || ""; // Get the user's name if logged in

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
  const tax = total * 0.05; // 5% GST
  const grandTotal = total + tax;

  function generateBillPDF(cartItems, total, tax, grandTotal, customerName) {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Healthy Fruit Store - Bill", 10, 10);

    doc.setFontSize(12);
    doc.text(`Customer Name: ${customerName}`, 10, 20);

    let y = 40;
    doc.text("Item", 10, 30);
    doc.text("Qty", 100, 30);
    doc.text("Price", 140, 30);

    cartItems.forEach((item) => {
      doc.text(item.name, 10, y);
      doc.text(`${item.qty}`, 100, y);
      doc.text(`₹${(item.qty * item.mrp).toFixed(2)}`, 140, y);
      y += 10;
    });

    doc.text(`Subtotal: ₹${total.toFixed(2)}`, 10, y + 10);
    doc.text(`Tax (5% GST): ₹${tax.toFixed(2)}`, 10, y + 20);
    doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 10, y + 30);

    doc.save(`${customerName}-bill.pdf`); // Download the PDF
  }

  const handleBillGeneration = () => {
    if (!loggedInUser) {
      alert("Please log in to generate the bill!"); // Prevent bill generation if not logged in
      return;
    }
    generateBillPDF(cartItems, total, tax, grandTotal, customerName);
  };

  return (
    <div className="cart">
      <h3>Billing Section</h3>

      <div className="billing-details">
        <label>Customer Name:</label>
        <input
          type="text"
          name="customerName"
          value={customerName}
          readOnly // Auto-fill the user's name if logged in, non-editable
        />
      </div>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item">
              <div className="cart-item-info">
                <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px" }} />
                <div>
                  <p>
                    {item.name} ({item.qty} {item.unit})
                  </p>
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
      )}

      <div className="cart-total">
        <p>Subtotal: ₹{total.toFixed(2)}</p>
        <p>Tax (5% GST): ₹{tax.toFixed(2)}</p>
        <strong>Grand Total: ₹{grandTotal.toFixed(2)}</strong>
      </div>

      <button className="generate-bill-button" onClick={handleBillGeneration}>
        Generate & Download Bill
      </button>
    </div>
  );
}

export default Cart;
