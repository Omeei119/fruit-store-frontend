function ProductCard({ fruit, onAddToCart, cartItems, onUpdateCartItem }) {
  // Check if the item is already in the cart
  const cartItem = cartItems.find((item) => item.id === fruit.id);

  return (
    <div className="product-card col-3">
      {fruit.discount > 0 && <div className="discount-label">-{fruit.discount}%</div>}
      <img src={fruit.image} alt={fruit.name} />
      <h3>{fruit.name}</h3>
      <p>Price: ₹{fruit.mrp}</p>
      <p>Discount: {fruit.discount}%</p>
      {cartItem ? (
        <div className="item-controls">
          <button onClick={() => onUpdateCartItem(fruit.id, cartItem.qty - 1)} disabled={cartItem.qty === 1}>
            -
          </button>
          <span>{cartItem.qty}</span>
          <button onClick={() => onUpdateCartItem(fruit.id, cartItem.qty + 1)}>
            +
          </button>
        </div>
      ) : (
        <button onClick={() => onAddToCart(fruit)} disabled={!fruit.inStock}>
          {fruit.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
        
      )}
    </div>
  );
}

export default ProductCard;
