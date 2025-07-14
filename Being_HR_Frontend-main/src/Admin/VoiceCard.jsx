import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VoiceCard.css';

const VoiceCardForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    companyName: '',
    content: '',
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [cards, setCards] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true); // admin check loading
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('http://localhost:5000/check-admin', { credentials: 'include' });
        if (res.status === 401) {
          navigate('/login'); // Not logged in
          return;
        }
        const data = await res.json();
        if (!data.isAdmin) {
          navigate('/'); // Not admin
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

  useEffect(() => {
    if (!loading) {
      fetchVoiceCards();
    }
  }, [loading]);

  const fetchVoiceCards = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/voicecard', { credentials: 'include' });
      const data = await res.json();
      setCards(data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.designation || !formData.companyName || !formData.content) {
      setMessage("Please fill in all fields.");
      return;
    }

    const form = new FormData();
    if (image) form.append('image', image);
    form.append('name', formData.name);
    form.append('designation', formData.designation);
    form.append('companyName', formData.companyName);
    form.append('content', formData.content);

    try {
      let res, data;
      if (editingId) {
        res = await fetch(`http://localhost:5000/api/admin/voicecard/${editingId}`, {
          method: 'PUT',
          body: form,
          credentials: 'include'
        });
        data = await res.json();
      } else {
        if (!image) {
          setMessage("Please upload an image.");
          return;
        }
        res = await fetch('http://localhost:5000/api/admin/voicecard', {
          method: 'POST',
          body: form,
          credentials: 'include'
        });
        data = await res.json();
      }

      if (res.ok) {
        setMessage(data.message);
        setFormData({ name: '', designation: '', companyName: '', content: '' });
        setImage(null);
        setEditingId(null);
        fetchVoiceCards();
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error submitting form.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this voice card?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/voicecard/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setCards(cards.filter(card => card._id !== id));
      } else {
        setMessage(data.message || "Failed to delete.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error deleting voice card.");
    }
  };

  const handleEdit = (card) => {
    setFormData({
      name: card.name,
      designation: card.designation,
      companyName: card.companyName,
      content: card.content
    });
    setEditingId(card._id);
    setMessage("Edit mode: update fields and submit to modify.");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="voice-card-form">
      <h2>{editingId ? "Edit Voice Card" : "Create Voice Card"}</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Designation:</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">{editingId ? "Update Voice Card" : "Create Voice Card"}</button>
      </form>

      <h3>All Voice Cards</h3>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Company</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(card => (
            <tr key={card._id}>
              <td>
                <img src={card.image} alt={card.name} width="50" />
              </td>
              <td>{card.name}</td>
              <td>{card.designation}</td>
              <td>{card.companyName}</td>
              <td>{card.content}</td>
              <td>
                <button onClick={() => handleEdit(card)}>Edit</button>
                <button onClick={() => handleDelete(card._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoiceCardForm;
