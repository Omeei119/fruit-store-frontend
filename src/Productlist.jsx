import React, { useState } from "react";
import "./ProductList.css";

function ProductList({ fruits, setFruits, cartItems, onAddToCart, loggedInUser, onUpdateProduct, onDeleteProduct }) {
  const isAdmin = loggedInUser?.role === "admin"; // Check if user is admin
  const [editingProduct, setEditingProduct] = useState(null); // Product being edited
  const [showAddForm, setShowAddForm] = useState(false); // Toggle add product form
  const [newProduct, setNewProduct] = useState({
    name: "",
    mrp: 0,
    discount: 0,
    unit: "",
    image: "",
  }); // New product state

  const isItemInCart = (id) => cartItems.some((item) => item.id === id);

  // Handle edit click
  const handleEditClick = (product) => {
    setEditingProduct(product); // Open edit modal
  };

  // Handle delete product
  const handleDeleteClick = async (id) => {
    if (!id) {
      alert("Invalid product ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Using fetch with await for product deletion
        const response = await fetch(`http://localhost:3000/fruits/${id}`, {
          method: "DELETE",
        });

        // if (!response.ok) {
        //   throw new Error("Failed to delete product.");
        // }

        // Call parent handler for deletion if the product was successfully deleted
        await onDeleteProduct(id);
        alert("Product deleted successfully!");
      } catch (error) {
        alert("Failed to delete product.");
        console.error(error);
      }
    }
  };

  // Handle adding a new product
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!newProduct.name || !newProduct.mrp || !newProduct.unit ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Send POST request to add the new product using fetch and await
      const response = await fetch("http://localhost:3000/fruits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      // if (!response.ok) {
      //   throw new Error("Failed to add product.");
      // }

      const addedProduct = await response.json();
      setFruits((prevFruits) => [...prevFruits, addedProduct]); // Add to fruits array

      // Reset form fields and close the modal
      setNewProduct({ name: "", mrp: 0, discount: 0, unit: "", image: "" });
      setShowAddForm(false); // Close the add product form
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  // Handle edit form submission
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct?.id) {
      alert("Invalid product data.");
      return;
    }

    try {
      // Update the product using fetch with await
      const response = await fetch(`http://localhost:3000/fruits/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to update product.");
      }

      const updatedProduct = await response.json();
      await onUpdateProduct(updatedProduct); // Call parent handler to update the state
      setEditingProduct(null); // Close the edit form
      alert("Product updated successfully!");
    } catch (error) {
      alert("Failed to update product.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="text-center">
        {isAdmin && (
          <button className="add-product-btn" onClick={() => setShowAddForm(true)}>
            Add New Product
          </button>
        )}
      </div>
      <div className="product-list">
        {fruits.length > 0 ? (
          fruits.map((fruit) => (
            <div key={fruit.id} className="product-card">
              <img src={fruit.image} alt={fruit.name} />
              <h3>{fruit.name}</h3>
              <p>Price: ₹{fruit.mrp - fruit.discount} per {fruit.unit}</p>

              {isAdmin ? (
                <>
                  <button className="edit-btn" onClick={() => handleEditClick(fruit)}>
                    Edit
                  </button>{" "}
                  <button className="delete-btn" onClick={() => handleDeleteClick(fruit.id)}>
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onAddToCart(fruit)}
                  disabled={isItemInCart(fruit.id)}
                  className={isItemInCart(fruit.id) ? "added" : ""}
                >
                  {isItemInCart(fruit.id) ? "Added to Cart" : "Add to Cart"}
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">No products found. Try a different search term!</div>
        )}

        {/* Add Product Modal */}
        {showAddForm && (
          <div className="modal">
            <form className="edit-form" onSubmit={handleAddProductSubmit}>
              <h2>Add New Product</h2>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                />
              </label>
              <label>
                MRP:
                <input
                  type="number"
                  name="mrp"
                  value={newProduct.mrp}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, mrp: Number(e.target.value) }))}
                />
              </label>
              <label>
                Discount:
                <input
                  type="number"
                  name="discount"
                  value={newProduct.discount}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, discount: Number(e.target.value) }))}
                />
              </label>
              <label>
                Unit:
                <input
                  type="text"
                  name="unit"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, unit: e.target.value }))}
                />
              </label>
              <label>
                Image URL:
                <input
                  type="text"
                  name="image"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, image: e.target.value }))}
                />
              </label>
              <button type="submit">Add Product</button>
              <button type="button" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="modal">
            <form className="edit-form" onSubmit={handleEditFormSubmit}>
              <h2>Edit Product</h2>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </label>
              <label>
                MRP:
                <input
                  type="number"
                  name="mrp"
                  value={editingProduct.mrp}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({ ...prev, mrp: Number(e.target.value) }))

                  }
                />
              </label>
              <label>
                Discount:
                <input
                  type="number"
                  name="discount"
                  value={editingProduct.discount}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({ ...prev, discount: Number(e.target.value) }))
                  }
                />
              </label>
              <label>
                Unit:
                <input
                  type="text"
                  name="unit"
                  value={editingProduct.unit}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({ ...prev, unit: e.target.value }))
                  }
                />
              </label>
              <label>
                Image URL:
                <input
                  type="text"
                  name="image"
                  value={editingProduct.image}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({ ...prev, image: e.target.value }))
                  }
                />
              </label>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingProduct(null)}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductList;
