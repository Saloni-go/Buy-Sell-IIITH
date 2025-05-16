import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [updatedUser, setUpdatedUser] = useState(null); // Store editable fields
  const [message, setMessage] = useState(""); // Display update messages

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No token found. Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setUpdatedUser(response.data); // Initialize editable fields with current data
      } catch (error) {
        console.error("Error fetching profile", error.response?.data?.message || error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          age: updatedUser.age,
          contactNumber: updatedUser.contactNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(updatedUser); // Update UI with saved details
      setIsEditing(false); // Exit edit mode
      setMessage(response.data.message || "Profile updated successfully!");
    } catch (error) {
      setMessage("Error updating profile");
      console.error("Update error:", error.response?.data?.message || error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
          <Navbar />

      <h2>Welcome, {user.firstName} {user.lastName}</h2>
      
      {message && <p>{message}</p>}

      <p><strong>Email:</strong> {user.email} (Cannot be changed)</p>

      {isEditing ? (
        <>
          <label>First Name:
            <input type="text" name="firstName" value={updatedUser.firstName} onChange={handleChange} />
          </label>
          <br />
          <label>Last Name:
            <input type="text" name="lastName" value={updatedUser.lastName} onChange={handleChange} />
          </label>
          <br />
          <label>Age:
            <input type="number" name="age" value={updatedUser.age} onChange={handleChange} />
          </label>
          <br />
          <label>Contact Number:
            <input type="text" name="contactNumber" value={updatedUser.contactNumber} onChange={handleChange} />
          </label>
          <br />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Contact Number:</strong> {user.contactNumber}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
    </div>
  );
};

export default MyProfile;
