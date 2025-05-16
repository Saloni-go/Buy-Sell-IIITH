import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    // setLoading(true);
    // setMessage("");

    try {
      const storedUserData = localStorage.getItem('user_data');
      console.log("userDetalis:",storedUserData);
        const parsedUserData = JSON.parse(storedUserData);  // Convert JSON string to object
        console.log("userDetails:", parsedUserData);
        
        const userId = parsedUserData._id;  // Now you can access _id
        console.log("User ID:", userId);
      const productId = product._id;
      console.log("UserId and ProductId:",userId,productId);
      const response = await axios.post('http://localhost:5000/api/users/add-to-cart', { userId, productId });
      if(response.data.message === 'Buyer and Seller both  are same!!!'){
        setMessage('Buyer and Seller both  are same!!!');
      }
      else{
        setMessage("Item added to cart!!");
      }
      
      console.log("rsponse from backend:",response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
      // setMessage("Server error, please try again.");
    }

    // setLoading(false);
  };

  // const addToCart = () => {
  //   let cart = JSON.parse(localStorage.getItem("cart")) || [];
  //   cart.push(product);
  //   localStorage.setItem("cart", JSON.stringify(cart));
  //   alert("Product added to cart!");
  // };

  if (!product) return <h2>Loading...</h2>;

  return (
    <div>
          <Navbar />

      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} width="200" />
      <p>Price: ${product.price}</p>
      <p>Description: {product.description}</p>
      <button onClick={addToCart}>Add to Cart</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProductDetails;
