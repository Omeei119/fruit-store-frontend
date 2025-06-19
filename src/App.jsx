import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from './Header';
import Footer from "./Footer";
import ProductList from "./ProductList";
import Cart from "./Cart";
import SearchBar from "./SearchBar";
import "./App.css";

function App() {
  const [fruits, setFruits] = useState([]);  // List of fruits
  const [cartItems, setCartItems] = useState([]);  // List of cart items
  const [searchQuery, setSearchQuery] = useState("");  // Search query
  const [isCartVisible, setIsCartVisible] = useState(false);  // Toggle cart visibility
  const [loggedInUser, setLoggedInUser] = useState(null);  // Track logged-in user

  // Fetch fruit list on component mount
  useEffect(() => {
    async function fetchFruitList() {
      try {
        const response = await axios.get("http://localhost:3000/fruits");
        setFruits(response.data);  // Set fruits data
      } catch (error) {
        console.error("Error fetching fruits:", error);
      }
    }
    fetchFruitList();
  }, []);

  // Add product to cart
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevItems, { ...product, qty: 1 }];
    });
  };

  // Remove product from cart
  const handleRemoveFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Update quantity of product in cart
  const handleUpdateCartItem = (productId, newQty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  // Update product in the fruit list
  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const response = await axios.put(`http://localhost:3000/fruits/${updatedProduct.id}`, updatedProduct);
      if (response.status === 200) {
        setFruits((prevFruits) =>
          prevFruits.map((fruit) =>
            fruit.id === updatedProduct.id ? updatedProduct : fruit
          )
        );
        alert("Product updated successfully!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  // Delete product from fruit list
  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/fruits/${id}`);
      if (response.status === 200) {
        setFruits((prevFruits) => prevFruits.filter((fruit) => fruit.id !== id));
        alert("Product deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  // Filter fruits based on search query
  const filteredFruits = fruits.filter((fruit) =>
    fruit.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user); // Update user info after successful login
  };

  return (
    <div className="App">
      <Header
        onCartClick={() => setIsCartVisible(true)}
        onLoginSuccess={handleLoginSuccess}
        loggedInUser={loggedInUser}
      />
      <SearchBar onSearch={setSearchQuery} />
      <ProductList
        fruits={filteredFruits}
        onAddToCart={handleAddToCart}
        cartItems={cartItems}
        loggedInUser={loggedInUser}
        onUpdateProduct={handleUpdateProduct}  // Pass update handler
        onDeleteProduct={handleDeleteProduct}  // Pass delete handler
      />
      {isCartVisible && (
        <div className="cart-popup">
          <div className="cart-overlay" onClick={() => setIsCartVisible(false)}></div>
          <div className="cart-content">
            <Cart
              cartItems={cartItems}
              // onRemoveFromCart={handleRemoveFromCart}
              // onUpdateCartItem={handleUpdateCartItem}

              onRemoveFromCart={(productId) => {
                setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
              }}
              onUpdateCartItem={(productId, qty) => {
                setCartItems((prevItems) =>
                  prevItems.map((item) =>
                    item.id === productId ? { ...item, qty } : item
                  )
                );
              }}
              loggedInUser={loggedInUser} // Pass user to Cart
            />

            <button
              className="close-cart"
              onClick={() => setIsCartVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
}

export default App;
