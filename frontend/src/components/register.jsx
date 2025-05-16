import { useState } from "react";
import { useNavigate ,Navigate} from "react-router-dom";
import axios from "axios";



const Register = () => {

  // function LoginButton() {
  //   const navigate = useNavigate();
  // }

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    contactNumber: "",
    password: "",
  });

  const navigate = useNavigate(); // Hook to navigate between pages

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post("http://localhost:5000/api/users/register", user);
      
      if (response.data.token) {
        // Store user data and token in localStorage
        localStorage.setItem("user_data", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.token);

        // Optionally, log the stored data for debugging
        const storedUser = localStorage.getItem("user_data");
        console.log("User data stored is:", storedUser);

        const storedToken = localStorage.getItem("token");
        console.log("Token stored is:", storedToken);

        alert("Registered Successfully!");
        navigate("/home"); // Redirect to homepage after successful registration
      } else {
        alert("Registration failed!");
      }
    } catch (error) {
      console.error("Error: ", error.response?.data?.message || "Registration failed");
    }

    //   console.log("Register function");
    //   await axios.post("http://localhost:5000/api/users/register", user);

    //   // if(response.data.success){
    //     // localStorage.setItem("user", JSON.stringify(response.data.user));
    //     alert("Registered Successfully!");
    //   navigate("/home"); // Redirect to homepage after successful registration
    //   // }
    //   // else{
    //   //   console.log("registration field");
    //   // }
      
    // } catch (error) {
    //   console.error("Error: ", error.response?.data?.message || "Registration failed");
    // }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
      <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        pattern="^[^@]+@(research|students)\.iiit\.ac\.in$"
        title="Please enter a valid IIIT Hyderabad email"
        required
      />
      <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
      <input
        type="text"
        name="contactNumber"
        placeholder="Contact Number"
        onChange={handleChange}
        pattern="^\d{10}$"
        title="exactly 10 digits."
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        pattern=".{6,}"
        title="at least 6 characterS"
        required
      />

      <button type="submit">Register</button>

      <p>For login: <a href="/login">Login</a></p>
      
    </form>
  );
};

export default Register; 
