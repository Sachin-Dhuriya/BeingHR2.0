import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import "./Blog.css";

const Blog = () => {
  const [showForm, setShowForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [blogs, setBlogs] = useState([]); // state to hold blogs from API

  const navigate = useNavigate();

  // Fetch blogs on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/blog", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          // Filter only approved blogs
          const approvedBlogs = data.filter(blog => blog.isApprove === true);
          setBlogs(approvedBlogs);
        } else {
          console.error("Failed to fetch blogs");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  // Check authentication status & get user name
  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const authRes = await fetch("http://localhost:5000/auth-status", { credentials: "include" });
        const authData = await authRes.json();

        if (authData.isAuthenticated) {
          setIsAuthenticated(true);
          const userRes = await fetch("http://localhost:5000/user", { credentials: "include" });
          if (userRes.ok) {
            const userData = await userRes.json();
            setFormData(prev => ({ ...prev, author: userData.name }));
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication or fetching user:", error);
      }
    };

    checkAuthAndFetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("You must be logged in to submit a blog.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Blog submitted successfully!");
        setFormData({ title: "", content: "", author: formData.author });
        setShowForm(false);

        // Refresh blogs list after submitting
        const updatedRes = await fetch("http://localhost:5000/api/admin/blog", { credentials: "include" });
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          const approvedBlogs = updatedData.filter(blog => blog.isApprove === true);
          setBlogs(approvedBlogs);
        }

      } else {
        const data = await res.json();
        alert(`Failed to submit blog: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("An error occurred while submitting the blog.");
    }
  };

  return (
    <div className="BN-container">
      <h1 className="BN-title">Blogs - BeingHR Community</h1>
      <p className="BN-subtitle">
        The BeingHR Blog is your go-to destination for insightful articles, thought leadership, and the latest updates from the world of HR.
      </p>

      {/* Blogs Section */}
      <section className="BN-section">
        <h2 className="BN-section-title">Blogs</h2>
        <div className="BN-grid">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="BN-card">
                <h3 className="BN-card-title">{blog.title}</h3>
                <div className="BN-card-desc" dangerouslySetInnerHTML={{ __html: blog.content }} />
                <p className="BN-card-likes">👍 {blog.likes || 0} {blog.likes === 1 ? "Like" : "Likes"}</p>
                <p className="BN-card-author">Author: {blog.author}</p>
                <p className="BN-card-date">Published: {new Date(blog.date).toLocaleDateString()}</p>
                <button
                  className="BN-button"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  Read More
                </button>

              </div>
            ))
          ) : (
            <p>No approved blogs found.</p>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <div className="BN-cta">
        <h3 className="BN-cta-title">Ready to contribute in our blog</h3>
        <div className="BN-cta-buttons">
          <button
            className="BN-button BN-button-purple"
            onClick={() => setShowForm(!showForm)}
            disabled={!isAuthenticated}
          >
            {showForm ? "Close Form" : "Contribute to Our Blog"}
          </button>
          {!isAuthenticated && (
            <p className="BN-auth-warning">* Please login to contribute.</p>
          )}
        </div>
      </div>

      {/* Blog Submission Form */}
      {showForm && (
        <form className="BN-form" onSubmit={handleSubmit}>
          <h3 className="BN-form-title">Contribute Your Blog</h3>
          <input
            className="BN-form-input"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <ReactQuill
            className="BN-form-textarea"
            theme="snow"
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            placeholder="Write your blog content here..."
          />

          <input
            className="BN-form-input"
            name="author"
            placeholder="Author Name"
            value={formData.author}
            readOnly
          />
          <button className="BN-button BN-button-purple" type="submit">
            Submit Blog
          </button>
        </form>
      )}
    </div>
  );
};

export default Blog;
