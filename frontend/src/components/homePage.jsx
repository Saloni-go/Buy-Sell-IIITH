import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './homePage.css';
import {Link} from 'react-router-dom'; //imports link 
//axios: makes http requests (to fetch and post data to a server).
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';



const categories = [
  "Electronics",
  "Fashion",
  "Home",
  "Books",
  "Beauty & Personal Care",
  "Sports",
];


const HomePage = () => {
  const [products, setProducts] = useState([]);//products will store the list of products fetched from the backend.
  const [newProduct, setNewProduct] = useState({//newproduct stores the new product data
    name: '',
    price: '',
    image: '',
    category: '',
    description: '' // New description field
  });

  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user_data'));
  const sellerId = userData ? userData._id : null; // Extract seller ID from localStorage
  console.log("seller_id: ",sellerId);

  const [searchTerm, setSearchTerm] = useState('');  //a state to store text input from user by searching product name.
  const [selectedCategory, setSelectedCategory] = useState(''); //a state to store selected category filter.
  const [selectedDescription, setSelectedDescription] = useState(''); // New state for description filter
  const [sellerNames, setSellerNames] = useState({});

  const openUpdateForm = (product) => {
    navigate(`/update-product/${product._id}`);
  };
  

  useEffect(() => {  
    //a react hook that runs code after the component mounts.
    fetchProducts(); //runs this func once when the component is loaded (the empty dependency array[] ensures it runes only once. )
  }, []);//if we had for example [searchTerm], then it would have re-run every time when searchTerm changes.

  const fetchProducts = async () => { //fetches product and returns the products state with the data returned by the server.and store it in products.
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        console.log('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const navigate=useNavigate();

  const handleProductClick = (id) => {
    navigate(`/products/${id}`); // Redirect to product details page
  };

  const handleChange = (e) => { //e:event; handle changes in the form inputs (for adding a new product)
    const { name, value } = e.target; //extracts the name and value from the event targer which is input field and updates the newproduct state accordingly.
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value
    }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!sellerId) {
      console.log('Seller ID is missing. Please log in.');
      return;
    }

    try {
      const productData = { ...newProduct, sellerId }; // Include sellerId in the product data

      const response = await axios.post('http://localhost:5000/api/products', productData);

      if (response.data.success) {
        fetchProducts();
        setNewProduct({ name: '', price: '', image: '', category: '', description: '' });
      } else {
        console.log('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleSearchChange = (e) => { //when user types in search input field, then this function gets triggered.
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => { //this funcn is triggered when the user selects a category from dropdown.
    setSelectedCategory(e.target.value); // Update the selected category
  };

  const handleDescriptionChange = (e) => { //function triggers when the user types into description filter input field.
    setSelectedDescription(e.target.value); // Update the selected description
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/products/${id}`);
      if (response.data.success) {
        fetchProducts(); // Refresh the product list after deletion
      } else {
        console.log("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  
  const handleUpdate = async (productId) => {
    const updatedProduct = products.find((product) => product._id === productId);
    
    if (!updatedProduct) {
      console.log("Product not found");
      return;
    }
  
    try {
      const response = await axios.put(`http://localhost:5000/api/products/${productId}`, updatedProduct);
  
      if (response.data.success) {
        fetchProducts(); // Refresh list after updating
      } else {
        console.log("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  
  

  const filteredProducts = products.filter((product) => { //filters prodcts based on 3 condns:
    const matchesName = product.name.toLowerCase().includes(searchTerm.toLowerCase()); //the product's name must include the searchterm(case-insensitive)
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true; //product caeogry must match the selected cateogry. no cateogry selected, then the condn always true.
    const matchesDescription = selectedDescription ? product.description.toLowerCase().includes(selectedDescription.toLowerCase()) : true; //description (case-insensitive). if no description provided, this condn always true.
    return matchesName && matchesCategory && matchesDescription; // Filter by name, category, and description
  });

  //RENDERING THE UI
  return (
    <div>
      <Navbar />
      <h1>BuY-SeLL</h1>

      {/* Category Filter */}
      <select value={selectedCategory} onChange={handleCategoryChange}>    {/*WHENEVER THE USER SELECTS A CATEGORY, THE HANDLE CATEGORY CHANGE FUNCN IS TRIGGERED, UPDATING THE SELECTED CATEGORY STATE.*/}
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
        <option value="home">Home</option>
        {/* Add more categories as needed */}
      </select>

      {/* Description Filter */}
      <input type="text"
        placeholder="Search by description..."
        value={selectedDescription}
        onChange={handleDescriptionChange}
        style={{ marginBottom: '20px' }}
      />

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px' }}
      />

      {/* Add New Product Form */}
      <form onSubmit={handleSubmit}> {/*FORM IS rendered to add a new pdt, handlesubmit is triggered when form in submitted.*/}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={newProduct.price}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Product Image URL"
          value={newProduct.image}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Product Category"
          value={newProduct.category}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={newProduct.description}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Add Product</button>
      </form>

      <h2>Product List</h2>
      <ul>
        {filteredProducts.map((product) => ( //filtered pdts is an array of pdts that matach the search criteria (filtered by name, category and description)
        <li key={product._id} onClick={() => handleProductClick(product._id)} style={{ cursor: 'pointer' }}>
            <p>Name: {product.name}</p>
            <p>Price: {product.price}</p>
            <p>Category: {product.category}</p> {/* Display category */}
            <p>Description: {product.description}</p> {/* Display description */}
            <p>Seller: {product.sellerId}</p>
            <div>
              {product.image && <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }}>
            Delete
            </button>
            <button onClick={() => openUpdateForm(product)}>Update</button>

            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
