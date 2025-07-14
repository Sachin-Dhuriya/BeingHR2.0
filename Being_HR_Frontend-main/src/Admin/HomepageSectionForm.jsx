import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomepageSectionForm.css';

const HomepageSectionForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [homepageData, setHomepageData] = useState(null);
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
          navigate('/'); // Logged in but not admin
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
      fetchHomepageSection();
    }
  }, [loading]);

  const fetchHomepageSection = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/homepage-section', { withCredentials: true });
      setHomepageData(response.data.homepageSection);
    } catch (error) {
      console.error('Error fetching homepage section:', error.message);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length !== 10) {
      alert('Please upload exactly 10 images.');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length !== 10) {
      alert('You must upload exactly 10 images.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await axios.post(
        'http://localhost:5000/api/admin/homepage-section',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      setMessage('Upload successful!');
      setTitle('');
      setContent('');
      setImages([]);
      fetchHomepageSection();
    } catch (error) {
      console.error('Error uploading:', error);
      setMessage('Upload failed. Please check the console.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="homepage-form-container">
      <h2>Upload Homepage Section</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Content:</label>
          <textarea
            value={content}
            required
            onChange={(e) => setContent(e.target.value)}
            rows="5"
          ></textarea>
        </div>

        <div>
          <label>Upload 10 Images:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            required
            onChange={handleImageChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      {message && <p className="message">{message}</p>}

      {homepageData && (
        <div className="homepage-preview">
          <h3>📌 Current Homepage Section</h3>
          <h4>{homepageData.title}</h4>

          <div className="content-preview">
            {homepageData.content.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>

          <div className="image-grid">
            {homepageData.images.map((img, index) => (
              <div key={index} className="image-item">
                <img src={img.url} alt={img.caption} />
                <p>{img.caption}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageSectionForm;
