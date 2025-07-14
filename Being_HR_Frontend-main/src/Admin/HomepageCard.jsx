import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomepageCard.css';

const HomepageCard = () => {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cards, setCards] = useState([]);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true); // admin check loading
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('http://localhost:5000/check-admin', { credentials: 'include' });
        if (res.status === 401) {
          navigate('/login'); // not logged in
          return;
        }
        const data = await res.json();
        if (!data.isAdmin) {
          navigate('/'); // logged in but not admin
          return;
        }
      } catch (error) {
        console.error('Error checking admin:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  const fetchCards = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/cards', { withCredentials: true });
      setCards(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load cards.");
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchCards();
    }
  }, [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || (!imageFile && !isEditing)) {
      return setMessage("Please fill all fields. Image is required for new cards.");
    }

    const form = new FormData();
    if (imageFile) form.append('image', imageFile);
    form.append('title', formData.title);
    form.append('content', formData.content);

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/admin/cards/${editId}`, form, { withCredentials: true });
        setMessage('Card updated!');
      } else {
        await axios.post('http://localhost:5000/api/admin/cards', form, { withCredentials: true });
        setMessage('Card created!');
      }

      setFormData({ title: '', content: '' });
      setImageFile(null);
      setPreview(null);
      setIsEditing(false);
      setEditId(null);
      fetchCards();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Error occurred.');
    }
  };

  const handleEdit = (card) => {
    setFormData({ title: card.title, content: card.content });
    setPreview(card.image);
    setIsEditing(true);
    setEditId(card._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/cards/${id}`, { withCredentials: true });
      setMessage('Card deleted.');
      fetchCards();
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete card.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card-form-container">
      <form className="card-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? "Edit Card" : "Create a Card"}</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {preview && <img src={preview} alt="Preview" style={{ width: '100%', marginTop: '10px', borderRadius: '5px' }} />}

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">{isEditing ? "Update" : "Submit"}</button>

        {message && <p className="response-message">{message}</p>}
      </form>

      <div className="card-table">
        <h2>All Cards</h2>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Content</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.length === 0 ? (
              <tr><td colSpan="4">No cards found.</td></tr>
            ) : (
              cards.map(card => (
                <tr key={card._id}>
                  <td><img src={card.image} alt={card.title} style={{ width: '100px' }} /></td>
                  <td>{card.title}</td>
                  <td style={{ whiteSpace: 'pre-wrap' }}>{card.content}</td>
                  <td>
                    <button onClick={() => handleEdit(card)}>Edit</button>
                    <button onClick={() => handleDelete(card._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomepageCard;
