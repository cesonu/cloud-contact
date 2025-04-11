import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Correct usage of hooks for React Router v6

const EditContactPage = () => {
  const { id } = useParams(); // Get the contact ID from URL params
  const navigate = useNavigate(); // For programmatically navigating after updating the contact
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // To show loading state while fetching data

  // Fetch the contact details when the component mounts
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/contacts/${id}`)
      .then((response) => {
        setName(response.data.name);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        setLoading(false); // Stop loading after data is fetched
      })
      .catch((err) => {
        setMessage("Error fetching contact data.");
        setLoading(false);
      });
  }, [id]);

  // Handle the form submission to update the contact
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the updated contact data
    const updatedContact = { name, email, phone };

    // Send PUT request to update the contact
    axios
      .put(`http://localhost:5000/api/contacts/${id}`, updatedContact)
      .then((response) => {
        setMessage("Contact updated successfully");
        navigate("/"); // Redirect to the homepage after updating the contact
      })
      .catch((err) => {
        setMessage("Error updating contact");
        console.log(err);
      });
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching the data
  }

  return (
    <div className="edit-contact">
      <h3>Edit Contact</h3>
      {message && <div className="error-message">{message}</div>} {/* Display success or error message */}
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />

        <label>Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone"
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditContactPage;
