import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom"; // React Router v6
import "./App.css";
import EditContactPage from "./components/EditContactPage";

// Add Contact Page
const AddContactPage = () => {
  const navigate = useNavigate(); // For redirecting after adding a contact
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // Handle form submission to add a new contact
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!name || !email || !phone) {
      setMessage("Please provide all required fields.");
      return;
    }

    const newContact = { name, email, phone };

    // Send data to the backend
    axios
      .post("https://cloudcontactbackend.onrender.com/api/contacts/", newContact)
      .then((response) => {
        setMessage("Contact added successfully.");
        setName("");
        setEmail("");
        setPhone("");
        navigate("/"); // Redirect to home page after adding the contact
      })
      .catch((err) => {
        setMessage("Error adding contact");
        console.log(err);
      });
  };

  return (
    <div className="add-contact">
      <h3>Add Contact</h3>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
        <div className="error-message">{message}</div>

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

        <button type="submit">Save Contact</button>
      </form>
    </div>
  );
};

// Home Page: List of Contacts
const HomePage = ({ contacts, handleDelete }) => {
  return (
    <div className="contact-list">
      <h3>Contact List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact._id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>
                <Link to={`/edit-contact/${contact._id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => handleDelete(contact._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// About Page: Explanation about the site
const AboutPage = () => {
  return (
    <div className="about-page">
      <h3>About CloudContact</h3>
      <p>
        CloudContact is a secure and efficient cloud-based contact management system designed to allow users to easily manage, add, edit, and delete their contacts. It provides a simple interface that integrates with a backend database to store contact information.
      </p>
      <h4>Features:</h4>
      <ul>
        <li>Manage contacts securely in the cloud</li>
        <li>CRUD operations: Create, Read, Update, and Delete contacts</li>
        <li>Responsive user interface for easy access on various devices</li>
      </ul>
      <p>
        This platform helps individuals and businesses keep their contact data organized and accessible anytime, anywhere.
      </p>
    </div>
  );
};

function App() {
  const [contacts, setContacts] = useState([]);

  // Fetch contacts from the backend when the component mounts
  useEffect(() => {
    axios
      .get("https://cloudcontactbackend.onrender.com/api/contacts/")
      .then((response) => setContacts(response.data))
      .catch((err) => console.log(err));
  }, []);

  // Handle delete contact
  const handleDelete = (id) => {
    console.log("Deleting contact with id:", id); // Log the id
    axios
      .delete(`https://cloudcontactbackend.onrender.com/api/contacts/${id}`)
      .then(() => {
        setContacts(contacts.filter(contact => contact._id !== id));
      })
      .catch((err) => console.log(err));
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>CloudContact</h1>
          <nav>
            <Link to="/">Home</Link> | <Link to="/add-contact">Add Contact</Link> | <Link to="/about">About</Link>
          </nav>
        </header>
        <main>
          <h2>Welcome to CloudContact</h2>

          <Routes>
            {/* Home Route - Display Contact List */}
            <Route path="/" element={<HomePage contacts={contacts} handleDelete={handleDelete} />} />
            {/* Add Contact Route */}
            <Route path="/add-contact" element={<AddContactPage />} />
            {/* You can add Edit Contact Route here */}
            <Route path="/edit-contact/:id" element={<EditContactPage />} />
            {/* About Route */}
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
